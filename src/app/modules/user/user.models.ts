import { Error, Query, Schema, model } from 'mongoose';
import config from '../../config';
import bcrypt from 'bcrypt';
import { IUser, UserModel } from './user.interface';
import { Login_With, Role, USER_ROLE } from './user.constants';

const userSchema: Schema<IUser> = new Schema(
  {
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    deliveryMan: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    name: {
      type: String,
      required: true,
      default: null,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      default: null,
    },
    orderCharge: {
      type: Number,
    },

    password: {
      type: String,
      required: false,
    },

    gender: {
      type: String,
      enum: ['Male', 'Female', 'Others'],
      default: null,
    },

    profile: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: Role,
      default: USER_ROLE.user,
    },

    address: {
      type: String,
      default: null,
    },
    customerId: {
      type: String, 
    },

    location: {
      type: {
        type: String,
        default: 'Point',
      },
      coordinates: [Number],
    },

    needsPasswordChange: {
      type: Boolean,
    },

    passwordChangedAt: {
      type: Date,
    },
    expireAt: {
      type: Date,
      default: () => {
        const expireAt = new Date(); 
        return expireAt.setMinutes(expireAt.getMinutes() + 20);
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    loginWth: {
      type: String,
      enum: Login_With,
      default: Login_With.credentials,
    },
    verification: {
      otp: {
        type: Schema.Types.Mixed,
        default: 0,
      },
      expiresAt: {
        type: Date,
      },
      status: {
        type: Boolean,
        default: false,
      },
    },

    device: {
      ip: {
        type: String,
      },
      browser: {
        type: String,
      },
      os: {
        type: String,
      },
      device: {
        type: String,
      },
      lastLogin: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// set '' after saving password
userSchema.post(
  'save',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (error: Error, doc: any, next: (error?: Error) => void): void {
    doc.password = '';
    next();
  },
);

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.IsUserExistId = async function (id: string) {
  return await User.findById(id).select('+password');
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
