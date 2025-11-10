import { Types } from 'mongoose';
import Orders from '../orders/orders.models';
import { ORDER_STATUS } from '../orders/orders.constants';
import moment from 'moment';
import { initializeMonthlyData } from './dashboard.utils';
import { MonthlyIncome, monthlyOrders } from './dashboard.interface';
import Products from '../products/products.models';

const resturantDashboardTopCard = async (userId: string) => {
  const orderStats = await Orders.aggregate([
    {
      $match: {
        isDeleted: false,
        author: new Types.ObjectId(userId),
        paymentStatus: { $in: ['paid', 'cash_on_delivery', 'pickup'] },
      },
    },
    {
      $facet: {
        totalOrders: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],

        totalCustomers: [
          {
            $group: {
              _id: '$user',
            },
          },

          {
            $count: 'uniqueCustomers',
          },
        ],
        pickupIncome: [
          {
            $match: {
              status: ORDER_STATUS.delivered,
              paymentStatus: { $in: ['cash_on_delivery', 'pickup'] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ['$totalPrice', 0.95] } },
            },
          },
        ],
        onlineIncome: [
          {
            $match: {
              status: ORDER_STATUS.delivered,
              paymentStatus: 'paid',
            },
          },

          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ['$totalPrice', 0.9] } },
            },
          },
        ],

        toDayIncome: [
          {
            $match: {
              status: ORDER_STATUS.delivered,
              createdAt: {
                $gte: moment().startOf('day').toDate(),
                $lt: moment().endOf('day').toDate(),
              },
            },
          },

          {
            $addFields: {
              calculatedIncome: {
                $cond: {
                  if: {
                    $in: ['$paymentStatus', ['cash_on_delivery', 'pickup']],
                  },
                  then: { $multiply: ['$totalPrice', 0.95] },
                  else: {
                    $cond: {
                      if: { $eq: ['$paymentStatus', 'paid'] },
                      then: { $multiply: ['$totalPrice', 0.9] },
                      else: 0,
                    },
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$calculatedIncome' },
            },
          },
        ],
        yesterdayIncome: [
          {
            $match: {
              status: ORDER_STATUS.delivered,
              createdAt: {
                $gte: moment().subtract(1, 'days').startOf('day').toDate(),
                $lt: moment().subtract(1, 'days').endOf('day').toDate(),
              },
            },
          },

          {
            $addFields: {
              calculatedIncome: {
                $cond: {
                  if: {
                    $in: ['$paymentStatus', ['cash_on_delivery', 'pickup']],
                  },
                  then: { $multiply: ['$totalPrice', 0.95] },
                  else: {
                    $cond: {
                      if: { $eq: ['$paymentStatus', 'paid'] },
                      then: { $multiply: ['$totalPrice', 0.9] },
                      else: 0,
                    },
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$calculatedIncome' },
            },
          },
        ],
        totalIncome: [
          {
            $match: {
              status: ORDER_STATUS.delivered,
              paymentStatus: { $in: ['paid', 'cash_on_delivery', 'pickup'] },
            },
          },

          {
            $addFields: {
              calculatedIncome: {
                $cond: {
                  if: {
                    $in: ['$paymentStatus', ['cash_on_delivery', 'pickup']],
                  },
                  then: { $multiply: ['$totalPrice', 0.95] },
                  else: {
                    $cond: {
                      if: { $eq: ['$paymentStatus', 'paid'] },
                      then: { $multiply: ['$totalPrice', 0.9] },
                      else: 0,
                    },
                  },
                },
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$calculatedIncome' },
            },
          },
        ],
      },
    },
  ]);

  const stats = orderStats[0];
  const totalOrders = stats.totalOrders[0]?.total || 0;
  const totalCustomers = stats.totalCustomers[0]?.uniqueCustomers || 0;
  const toDayIncome = stats.toDayIncome[0]?.total || 0;
  const totalIncome = stats.totalIncome[0]?.total || 0;
  const yesterdayIncome = stats.yesterdayIncome[0]?.total || 0;

  return {
    totalCustomers,
    totalOrders,
    toDayIncome,
    totalIncome,
    yesterdayIncome,
  };
};

const resturantDashboardChart = async (query: Record<string, any>) => {
  const incomeYear = query.incomeYear || moment().year();
  const orderYear = query.orderYear || moment().year();

  const orderStatus = await Orders.aggregate([
    {
      $facet: {
        monthlyOrders: [
          {
            $match: {
              isDeleted: false,
              author: new Types.ObjectId(query.userId),
              createdAt: {
                $gte: moment().year(orderYear).startOf('year').toDate(),
                $lte: moment().year(orderYear).endOf('year').toDate(),
              },
            },
          },
          {
            $group: {
              _id: { month: { $month: '$createdAt' } },
              total: { $sum: 1 },
            },
          },
          { $sort: { '_id.month': 1 } },
        ],

        monthlyIncome: [
          {
            $match: {
              paymentStatus: { $in: ['paid', 'cash_on_delivery', 'pickup'] },
              status: ORDER_STATUS.delivered,
              isDeleted: false,
              author: new Types.ObjectId(query.userId),
              createdAt: {
                $gte: moment().year(incomeYear).startOf('year').toDate(),
                $lte: moment().year(incomeYear).endOf('year').toDate(),
              },
            },
          },

          // 👇 Add this stage to calculate income based on paymentStatus
          {
            $addFields: {
              calculatedIncome: {
                $cond: {
                  if: {
                    $in: ['$paymentStatus', ['cash_on_delivery', 'pickup']],
                  },
                  then: { $multiply: ['$totalPrice', 0.95] },
                  else: {
                    $cond: {
                      if: { $eq: ['$paymentStatus', 'paid'] },
                      then: { $multiply: ['$totalPrice', 0.9] },
                      else: 0,
                    },
                  },
                },
              },
            },
          },

          // 👇 Group by month and sum the calculated income
          {
            $group: {
              _id: { month: { $month: '$createdAt' } },
              income: { $sum: '$calculatedIncome' },
            },
          },

          // {
          //   $group: {
          //     _id: { month: { $month: '$createdAt' } },
          //     income: { $sum: '$hotelOwnerAmount' },
          //   },
          // },
          // { $sort: { '_id.month': 1 } },
        ],
      },
    },
  ]).then(data => data[0]);

  const monthlyIncome = initializeMonthlyData('income') as MonthlyIncome[];
  orderStatus.monthlyIncome.forEach(
    ({ _id, income }: { _id: { month: number }; income: number }) => {
      monthlyIncome[_id.month - 1].income = Math.round(income);
    },
  );

  
  const monthlyOrders = initializeMonthlyData('total') as monthlyOrders[];
  orderStatus.monthlyOrders.forEach(
    ({ _id, total }: { _id: { month: number }; total: number }) => {
      monthlyOrders[_id.month - 1].total = Math.round(total);
    },
  );

  return {
    monthlyIncome,
    monthlyOrders,
  };
};

const resturantDashboardTables = async (query: Record<string, any>) => {
  const orders = await Orders.find({ author: query.userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate([
      { path: 'orderItems.product' },
      { path: 'additionalItems.topping' },
    ]);
  const topSellingProducts = await Products.find({ author: query.userId })
    .sort({ totalSell: -1 })
    .limit(5);
  return {
    orders,
    topSellingProducts,
  };
};

const resturantCustomerList = async (query: Record<string, any>) => {
  const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const skip = (page - 1) * limit;

  const pipeline: any[] = [
    {
      $match: {
        isDeleted: false,
        author: new Types.ObjectId(query.userId),
      },
    },
    {
      $group: {
        _id: '$user', // unique customers
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
  ];

 
  if (query?.searchTerm) {
    pipeline.push({
      $match: {
        $or: ['name', 'email'].map(field => ({
          [`user.${field}`]: {
            $regex: query.searchTerm,
            $options: 'i',
          },
        })),
      },
    });
  }

  
  pipeline.push({
    $facet: {
      totalCount: [{ $count: 'uniqueCustomers' }],
      users: [
        { $sort: { 'user.createdAt': -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: '$user._id',
            name: '$user.name',
            email: '$user.email',
            phoneNumber: '$user.phoneNumber',
            status: '$user.status',
            createdAt: '$user.createdAt',
            location: '$user.location',
          },
        },
      ],
    },
  });

   
  pipeline.push({
    $project: {
      uniqueCustomers: {
        $ifNull: [{ $arrayElemAt: ['$totalCount.uniqueCustomers', 0] }, 0],
      },
      users: 1,
    },
  });

  const result = await Orders.aggregate(pipeline);
  return {
    data: result[0].users || [],
    meta:{
      total: result[0].uniqueCustomers || 0,
      page,
      limit,
    }
  };
};

export const dashboardService = {
  resturantDashboardTopCard,
  resturantDashboardChart,
  resturantDashboardTables,
  resturantCustomerList,
};
