import { Types } from 'mongoose';
import Orders from '../orders/orders.models';
import { ORDER_STATUS } from '../orders/orders.constants';
import moment from 'moment';
import { initializeMonthlyData } from './dashboard.utils';
import { MonthlyIncome, monthlyOrders } from './dashboard.interface';
import Products from '../products/products.models';
import { User } from '../user/user.models';
import { USER_ROLE } from '../user/user.constants';
import Shop from '../shop/shop.models';

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
              total: { $sum: '$resturantPercentage' },
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
              total: { $sum: '$resturantPercentage' },
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

          // {
          //   $addFields: {
          //     calculatedIncome: {
          //       $cond: {
          //         if: {
          //           $in: ['$paymentStatus', ['cash_on_delivery', 'pickup']],
          //         },
          //         then: { $multiply: ['$totalPrice', 0.95] },
          //         else: {
          //           $cond: {
          //             if: { $eq: ['$paymentStatus', 'paid'] },
          //             then: { $multiply: ['$totalPrice', 0.9] },
          //             else: 0,
          //           },
          //         },
          //       },
          //     },
          //   },
          // },
          {
            $group: {
              _id: null,
              total: { $sum: '$resturantPercentage' },
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

          // {
          //   $addFields: {
          //     calculatedIncome: {
          //       $cond: {
          //         if: {
          //           $in: ['$paymentStatus', ['cash_on_delivery', 'pickup']],
          //         },
          //         then: { $multiply: ['$totalPrice', 0.95] },
          //         else: {
          //           $cond: {
          //             if: { $eq: ['$paymentStatus', 'paid'] },
          //             then: { $multiply: ['$totalPrice', 0.9] },
          //             else: 0,
          //           },
          //         },
          //       },
          //     },
          //   },
          // },
          {
            $group: {
              _id: null,
              total: { $sum: '$resturantPercentage' },
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

          // {
          //   $addFields: {
          //     calculatedIncome: {
          //       $cond: {
          //         if: {
          //           $in: ['$paymentStatus', ['cash_on_delivery', 'pickup']],
          //         },
          //         then: { $multiply: ['$totalPrice', 0.95] },
          //         else: {
          //           $cond: {
          //             if: { $eq: ['$paymentStatus', 'paid'] },
          //             then: { $multiply: ['$totalPrice', 0.9] },
          //             else: 0,
          //           },
          //         },
          //       },
          //     },
          //   },
          // },
          {
            $group: {
              _id: null,
              total: { $sum: '$resturantPercentage' },
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
          // {
          //   $addFields: {
          //     calculatedIncome: {
          //       $cond: {
          //         if: {
          //           $in: ['$paymentStatus', ['cash_on_delivery', 'pickup']],
          //         },
          //         then: { $multiply: ['$totalPrice', 0.95] },
          //         else: {
          //           $cond: {
          //             if: { $eq: ['$paymentStatus', 'paid'] },
          //             then: { $multiply: ['$totalPrice', 0.9] },
          //             else: 0,
          //           },
          //         },
          //       },
          //     },
          //   },
          // },

          // 👇 Group by month and sum the calculated income
          {
            $group: {
              _id: { month: { $month: '$createdAt' } },
              income: { $sum: '$resturantPercentage' },
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
    meta: {
      total: result[0].uniqueCustomers || 0,
      page,
      limit,
    },
  };
};

const adminDashboardTopCard = async () => {
  const orderStats = await Orders.aggregate([
    {
      $match: {
        isDeleted: false,
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
              total: { $sum: '$adminPercentage' },
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
              total: { $sum: '$adminPercentage' },
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
            $group: {
              _id: null,
              total: { $sum: '$adminPercentage' },
            },
          },
        ],
      },
    },
  ]);
  const totalUsers = await User.countDocuments({
    role: USER_ROLE.user,
    isDeleted: false,
  });
  const totalResturant = await Shop.countDocuments({
    isDeleted: false,
  });
  const stats = orderStats[0];
  const totalOrders = stats.totalOrders[0]?.total || 0;
  const totalIncome = stats.totalIncome[0]?.total || 0;

  return {
    totalUsers,
    totalResturant,
    totalOrders,
    totalIncome,
  };
};

const adminDashboardChart = async (query: Record<string, any>) => {
  const incomeYear = query.incomeYear || moment().year();
  const orderYear = query.orderYear || moment().year();

  const orderStatus = await Orders.aggregate([
    {
      $facet: {
        topOrders: [
          {
            $match: {
              isDeleted: false,
              status: { $ne: 'canceled' },
              createdAt: {
                $gte: moment().year(orderYear).startOf('year').toDate(),
                $lte: moment().year(orderYear).endOf('year').toDate(),
              },
            },
          },

          {
            $group: {
              _id: '$author',
              totalSales: { $sum: '$totalPrice' },
              totalOrders: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: 'shops',
              localField: '_id',
              foreignField: 'author',
              as: 'shop',
            },
          },

          { $unwind: '$shop' },
          {
            $project: {
              _id: 0,
              authorId: '$_id',
              totalSales: 1,
              totalOrders: 1,
              'author.name': 1,
              'author.email': 1,
              'author.profile': 1,
              'shop.shopName': 1,
              'shop.profile': 1,
              'shop.banner': 1,
              'shop.bannerColor': 1,
            },
          },
          {
            $sort: { totalSales: -1 },
          },
          {
            $limit: 5,
          },
        ],

        monthlyIncome: [
          {
            $match: {
              paymentStatus: { $in: ['paid', 'cash_on_delivery', 'pickup'] },
              status: ORDER_STATUS.delivered,
              isDeleted: false,
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
                  then: { $multiply: ['$totalPrice', 0.05] },
                  else: {
                    $cond: {
                      if: { $eq: ['$paymentStatus', 'paid'] },
                      then: { $multiply: ['$totalPrice', 0.1] },
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

        recentlyPlacedOrder: [
          {
            $match: {
              paymentStatus: { $in: ['paid', 'cash_on_delivery', 'pickup'] },
              // status: ORDER_STATUS.delivered,
              isDeleted: false,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 5,
          },
          // Populate user
          {
            $lookup: {
              from: 'users',
              localField: 'user',
              foreignField: '_id',
              as: 'user',
              pipeline: [
                {
                  $project: {
                    name: 1,
                    email: 1,
                    profile: 1,
                    phoneNumber: 1,
                  },
                },
              ],
            },
          },
          { $unwind: '$user' },

          // Populate author
          {
            $lookup: {
              from: 'users',
              localField: 'author',
              foreignField: '_id',
              as: 'author',
              pipeline: [
                {
                  $project: {
                    name: 1,
                    email: 1,
                    profile: 1,
                    phoneNumber: 1,
                  },
                },
              ],
            },
          },
          { $unwind: '$author' },

          // Populate orderItems.product
          {
            $lookup: {
              from: 'products',
              localField: 'orderItems.product',
              foreignField: '_id',
              as: 'orderProducts',
              pipeline: [
                {
                  $project: {
                    name: 1,
                    price: 1,
                    image: 1,
                    category: 1,
                  },
                },
              ],
            },
          },

          // Populate additionalItems.topping
          {
            $lookup: {
              from: 'toppings',
              localField: 'additionalItems.topping',
              foreignField: '_id',
              as: 'toppingItems',
              pipeline: [
                {
                  $project: {
                    name: 1,
                    price: 1,
                  },
                },
              ],
            },
          },
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

  const topOrders = orderStatus.topOrders || [];
  const recentlyPlacedOrder = orderStatus.recentlyPlacedOrder || [];

  return {
    monthlyIncome,
    topOrders,
    recentlyPlacedOrder,
  };
};

export const dashboardService = {
  resturantDashboardTopCard,
  resturantDashboardChart,
  resturantDashboardTables,
  resturantCustomerList,
  adminDashboardTopCard,
  adminDashboardChart,
};
