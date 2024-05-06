let users = [];

const findUser = (nickname) => {
  const name = nickname.trim();
  return users.find((user) => user.trim() === name);
};

const addUser = (nickname) => {
  const isExist = findUser(nickname);
  users.push(nickname);

  const currentUser = isExist || nickname;
  return { isExist: !!isExist, user: currentUser };
};

const removeUser = (nickname) => {
  const isExist = findUser(nickname);
  const index = users.indexOf(nickname);

  isExist && index > -1 && users.splice(index, 1);
  return;
};

const getUsers = () => {
  return users;
};

module.exports = { addUser, findUser, removeUser, getUsers };
