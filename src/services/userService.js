import UserModel from './../models/userModel'

export const getUsers = () => {
  return UserModel.find({})
}

export const getUserByEmail = email => {
  return UserModel.findOne({ email })
}

export const getUserById = id => {
  return UserModel.findOne({ _id: id }).exec()
}

export const updateUser = (id, update) => {
  return UserModel.findOneAndUpdate({ _id: id }, update)
}

export const deleteUser = id => {
  return UserModel.findOneAndDelete({ _id: id })
}
