const Mailjs = require("@cemalgnlts/mailjs");
const { getMailCode } = require("./helpers");
const { getUsers } = require("./firebase");
const { signIn, boost, webAuthValidate } = require("./auth");

let mailConfirmationCode = "";
let userIndex = 0;
let users = [];

const mailjs = new Mailjs();

async function mailjsLogin({ username, password }) {
  const user =  await mailjs.login(username, password);

    mailjs.on("arrive", async (msg) => {
      mailConfirmationCode = getMailCode(msg);

      try {
        await boost('activate');

        activateNextUser();
      } catch (error) {
        console.error({ signInError: error });
      }

      mailjs.off();
    });

    setTimeout(() => {
      if (!mailConfirmationCode) {
        mailjs.off();
        activateUsers();
      }
    }, 60000);

    return user;
}

async function activateUsers() {
  try {
    users = (await getUsers()).slice(200).filter(Boolean);
    userIndex = 0;
    await validateUser();
  } catch (error) {
    console.error({ getUsersError: error });
  }
}

async function validateUser() {
  mailConfirmationCode = null;

  if (userIndex >= users.length) {
    userIndex = 0;
  }

  const user = users[userIndex];

  try {
    await mailjsLogin(user);
    await webAuthValidate({ value: user?.username });
  } catch (error) {
    console.error({ validateUserError: error });
  }
}

async function activateNextUser() {
  userIndex++;
  await validateUser();
}

try {
  activateUsers();
} catch (error) {
  console.error({ activateUsersError: error });
}

exports.activateUsers = activateUsers;
