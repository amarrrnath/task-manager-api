const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const Task = require("./task")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if(value < 0) {
                throw new Error("Age cant be negative. Common!!");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(value.includes("password")) {
                throw new Error("Password cannot contain 'password'. Seriously?")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            reuired: true
        }
    }], 
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual ("tasks", {
    ref: 'Task',
    localField: "_id",
    foreignField: "owner"
})

userSchema.methods.toJSON = function () {
    const userObj = this.toObject()
    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}

userSchema.methods.generateAuthToken = async function() {
    const token = await jwt.sign({_id: this.id}, process.env.JWT_SECRET);
    this.tokens.push({token});
    await this.save();
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user) {
        throw new Error("Unable to login!")
    }

    const isCorrect = await bcrypt.compare(password, user.password)
    if(!isCorrect) {
        throw new Error("Unable to login")
    }
    return user;
}

userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next()
})

userSchema.pre("remove", async function (next) {
    await Task.deleteMany({owner: this._id})
    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;