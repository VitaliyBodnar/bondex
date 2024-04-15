const Mailjs = require("@cemalgnlts/mailjs");
const mailjs = new Mailjs();
const {
  getMailCode,
  generateRandomUsername,
  generateRandomSurname,
  generateRandomNumbers,
  generateRandomJob,
} = require("./helpers");

const {
  signIn,
  accountOnboard,
  boost,
  authenticationValidate,
} = require("./auth");

const { setUser } = require("./firebase");

const inviteCode = "DLJSW";
let mailConfirmationCode = "";

async function mailjsCreateAccount() {
  const acc = await mailjs.createOneAccount();
  if (!acc) {
    create();
  }
  const user = acc.data;

  mailjs.on("arrive", (msg) => {
    mailConfirmationCode = getMailCode(msg);
    mailjs.off();

    signInProcess(user, mailConfirmationCode)
      .then(() => setUser(user))
      .then(() => create())
  });

  setTimeout(() => {
    if (!mailConfirmationCode) {
      mailjs.off();
      create();
    }
  }, 60000);

  return user;
}

function signInProcess(user, mailConfirmationCode) {
  return signIn(user.username, mailConfirmationCode)
    .then(() =>
      accountOnboard({
        inviteCode,
        step: 0,
      })
    )
    .then(() =>
      accountOnboard({
        firstName: generateRandomUsername(),
        lastName: generateRandomSurname(),
        headline: generateRandomJob(),
        step: 1,
      })
    )
    .then(() =>
      accountOnboard({
        step: 2,
        skip: true,
      })
    )
    .then(() =>
      accountOnboard({
        step: 3,
        phone: generateRandomNumbers(),
        countryCode: +1,
        isoCode: "UA",
      })
    )
    .then(() =>
      accountOnboard({
        step: 4,
        country: "United States",
        city: "Columbus",
        latitude: 39.9862,
        longitude: -82.9855,
      })
    )
    .then(() =>
      accountOnboard({
        step: 5,
        skip: true,
      })
    )
    .then(() => boost('create'))
    .catch((err) => {
      console.error({ signInProcessErr: err?.response?.status });
    });
}

function create() {
  mailjsCreateAccount()
    .then((user) => authenticationValidate(user.username).catch((err) => {
      console.log({ createErr: err?.response?.status || err });

      if (err?.response?.status === 429) {
        setTimeout(() => {
          create();
        }, 40000);

      } else {
        create();
      }
    
  }));
}

create();
