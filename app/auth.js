const { getFormData, getHeaders } = require("./helpers");

const axios = require("axios");

const baseUrl = "https://server.bondex.app";
const authenticationValidateToken =
  "03AFcWeA4qGM_1I7kUBdy9T8nU--GJfq6i2XrluXB-t8u_1dYl0qhsm3y07CWmFIvpVdSFNZ_ibA1JrQNuzqJYFu8bDUhD-UatGb_ewiV2y2EEzvjHcufTXBKw-3VeLjKWgG2Eqh2uLGRu72Tc1okfZmGZ-n7mj-e9WmJ6tDXFMVy3J7TcvO6TC3UdYMcW9wZc3WcLHMjS1dO8IdPsSTy4LJZZOzQBee64tS5mkpUWABolA9HCzSl29P3EesndUqBiz2pZVOX6QU5-qG3A7hag49OnRFIpLqra4tz8erlU0eBKYvwfhmEnxvnXXWvSiYfmoLPHtunVk5oQA08ATmzdScpCWiw-XQOlYKwnEoWYvvd_iWuoDcpIn2PjkejW4g733-QcNCbLq_AyjlUSYUkN7IAbVW4NpE08ig0YFJQ9N3iP89xiH1UHncFt-PE3IP20CYh8UWM6o0Z8L8RMxo7lpS-ownUKKZ8euYEtJBuQ9YQw8nXH9uJqX8VlhV9UQfa5Gio7ZzLjELBGT6mUNT9VNk9HBEhbpMpSP8vmbkzCDYnK_JAgUZZXWu6FPOZyoF5MGMY6wTxljS1izHcUaOhiziAOuSQab2Hn7CDE55J-hV-LKSxg1GbCUMMnhVJQ4gbtwu37U6ruL5UkSoaGARWsXcAzCggaFtIrhsozwbu07fv-0NKNeqjHKaEBw5oNTNexevNNMKS-5G6WOvq4ke-ksrxByF_6daVWGm3y5Ki2EvVZypCUIaB3RSGuUHNC8IX4T8NET0ZbsaTF9lpDJHsnIkvzjwxzZ4a8hFaE17L_9IH8bDJESs6vVTl3p4dfZBB2c2xMW7FGopP4FlbTl5NIG45bFjZYaO9Oz3dLZQUpYcGW4O3uruirER7HVbq01JzgujjrmQ7dOy_PXR1qBqJL3GpIvxEu1Ho_O95kNFeN9WyW5VjQ47TMbvxe6pD_56onfIcsWG7a6niO3xllDL4UESuDGQ724YAxYyJ4JyYzSpkAAsOfBSfZnkcxq3dm9ejbgSqTPiKb-FdqZPatuRyp1lsVdjxxYVVijNccKFXC8N_BIkbgL4MQkoSYfmDISYzlP4dSTRXwtrMfTDtKPS81o2mhFBCfpjhwl8znZF3MxPjdcH5_7MSguDmVPKK3wgcQvAkBLFUSg_SMPTWIYUu7BW0egjdkJmg30jDKftolKcl11vzr74jYbnuvf_QQnzUACkvQNjxg9lKUz43LXZF7vpnNvLFDt2-Z8LZo9zrlVeQy8oJUMlw7iN2VCrTpMOpqNSof3TNEAgXOfijWak3A13J6HIazn7Wn2U6h9RgH-FaQ4oq8ED9X_yJIgJGnyiuhQu_sRDGGlUsU-Y7991d36tpOwvNP03ErtoDkJ7NLo_qKaayyhADGddfqTTgrk2qfyu96YpVQ4c0XRSd1eABaBvO7Us84UgV_wobk-h_oSdLwri57HJMHElIT11iPlrHhWmjjJTxyFJcuqiVA5JDkgzeQ7Y9BEzbz1vVk9dh29kJab6GODCWFEXXZsEMTdVOlsgyZLlb0AZd_2LttxZo4InH8K5P_F1dc5SWHN3xIhBEBIbjlVvCl2hfQbjQTiPkYB68zy_8xGenTqFp3HGjcIkL3CxDdXbumKTCWnVZHOzhJpGmqoo-xxbS2u1pFkqY37WjueOtme_FEIsEwQdU7EEC9hSMoNRDUA7np3KytOFyqKSj89twhIzg";

let signInToken = "";

function signIn(username, mailConfirmationCode) {
  const payload = getFormData({
    value: username,
    code: mailConfirmationCode,
  });

  return axios
    .post(`${baseUrl}/Authentication/signin`, payload)
    .then((res) => {
      signInToken = res.data.data;
    })
    .catch((err) => {
      console.error({ errSignIn: err });
    });
}

function accountOnboard(data) {
  const headers = getHeaders(signInToken);
  const payload = getFormData(data);

  return axios
    .post(`${baseUrl}/Account/onboard`, payload, headers)
    .then()
    .catch((err) => {
      console.error({ accountOnboardErr: err.response, data });
    });
}

function boost() {
  return axios
    .post(`${baseUrl}/dashboard/boost`, {}, getHeaders(signInToken))
    .then(() => console.log("Boosted successfully", `${new Date().getHours()}:${new Date().getMinutes()}`))
    .catch((err) => {
      console.error({ boostErr: err });
    });
}

function webAuthValidate(data) {
  const payload = getFormData(data);

  return axios
    .post(`${baseUrl}/web/auth/validate`, payload)
    .then()
    // .catch((err) => {
    //   console.error({ webAuthValidateErr: err });
    // });
}

function authenticationValidate(username) {
  const payload = getFormData({
    value: username,
    token: authenticationValidateToken,
  });

  return axios.post(`${baseUrl}/Authentication/validate`, payload)
  .catch((err) => {
    console.error({ authenticationValidateErr: err });
  });
}

exports.signIn = signIn;
exports.webAuthValidate = webAuthValidate;
exports.authenticationValidate = authenticationValidate;
exports.accountOnboard = accountOnboard;
exports.boost = boost;
