const Mailjs = require("@cemalgnlts/mailjs");
const mailjs = new Mailjs();

const { getMailCode } = require("./helpers");
const { getUsers } = require("./firebase");
const { signIn, boost, webAuthValidate } = require("./auth");

let mailConfirmationCode = "";
let userIndex = 0;
let endIndex = 0;
let users = [];

async function mailjsLogin({ username, password }) {
  const loginUser = await mailjs.login(username, password);

  if (!loginUser) {
    validateUser(users[userIndex]);
  }

  mailjs.on("arrive", (msg) => {
    mailConfirmationCode = getMailCode(msg);

    signIn(username, mailConfirmationCode)
    .then(() => boost('activate'))
    .then(() => {
      userIndex++;

      if (!users[userIndex] || userIndex === endIndex) {
        return;
      }
      return validateUser(users[userIndex]);
    })
    .catch(() => validateUser(users[userIndex]));

    setTimeout(() => {
      if (!mailConfirmationCode) {
        userIndex++;
        return validateUser(users[userIndex]);
      }
    }, 60000);

    mailjs.off();
  });
}

async function validateUsers(startIndex) {
  users = await getUsers();
  userIndex = startIndex;

  validateUser(users[userIndex]).then();
}

function validateUser(user) {
  return mailjsLogin(user)
  .then(() => {
    return webAuthValidate({ value: user?.username }).catch((err) => {
      if (err?.response?.status === 429) {
        setTimeout(() => {
          validateUser(user);
        }, 40000);

      } else {
        validateUser(user);
      }
    })
  })
}

process.on('message', (chunk) => {
  endIndex = chunk[1];
  validateUsers(chunk[0]).then();
});
