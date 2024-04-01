const Mailjs = require("@cemalgnlts/mailjs");
const { getMailCode } = require("./helpers");
const { getUsers } = require("./firebase");
const { signIn, boost, webAuthValidate } = require("./auth");

let mailConfirmationCode = "";
let userIndex = 0;
let users = [];

const mailjs = new Mailjs();

async function mailjsLogin({ username, password }) {
  try {
    await mailjs.login(username, password);

    mailjs.on("arrive", async (msg) => {
      mailConfirmationCode = getMailCode(msg);

      try {
        await signIn(username, mailConfirmationCode);
        await boost();
        console.log("User activated:", { username, userIndex });
        userIndex++;
        await validateUser();
      } catch (error) {
        console.error({ signInError: error });
      }

      mailjs.off();
    });
  } catch (error) {
    console.error({ mailjsLoginError: error });
  }
}

async function activateUsers() {
  try {
    users = (await getUsers()).filter(Boolean);
    userIndex = 0;
    await validateUser();
  } catch (error) {
    console.error({ getUsersError: error });
  }
}

async function validateUser() {
  mailConfirmationCode = null;

  if (userIndex >= users.length) return;

  const user = users[userIndex];
  if (!user) {
    await activateNextUser();
    return;
  }

  try {
    await mailjsLogin(user);
    await webAuthValidate({ value: user?.username });
  } catch (error) {
    console.error({ validateUserError: error });
  }

  await activateNextUser();
}

async function activateNextUser() {
  userIndex++;
  await validateUser();
}

// try {
//   activateUsers();
// } catch (error) {
//   console.error({ activateUsersError: error });
// }

exports.activateUsers = activateUsers;
