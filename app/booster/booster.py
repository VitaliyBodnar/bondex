import os
import json
from datetime import datetime, timedelta
from dateutil import parser
import re
from time import sleep
import requests
from mailtm import Email
from faker import Faker


fake = Faker()
MAX_WAIT = 60


class BondexBooster:
    base_url = "https://server.bondex.app/"
    token = "03AFcWeA4qGM_1I7kUBdy9T8nU--GJfq6i2XrluXB-t8u_1dYl0qhsm3y07CWmFIvpVdSFNZ_ibA1JrQNuzqJYFu8bDUhD-UatGb_ewiV2y2EEzvjHcufTXBKw-3VeLjKWgG2Eqh2uLGRu72Tc1okfZmGZ-n7mj-e9WmJ6tDXFMVy3J7TcvO6TC3UdYMcW9wZc3WcLHMjS1dO8IdPsSTy4LJZZOzQBee64tS5mkpUWABolA9HCzSl29P3EesndUqBiz2pZVOX6QU5-qG3A7hag49OnRFIpLqra4tz8erlU0eBKYvwfhmEnxvnXXWvSiYfmoLPHtunVk5oQA08ATmzdScpCWiw-XQOlYKwnEoWYvvd_iWuoDcpIn2PjkejW4g733-QcNCbLq_AyjlUSYUkN7IAbVW4NpE08ig0YFJQ9N3iP89xiH1UHncFt-PE3IP20CYh8UWM6o0Z8L8RMxo7lpS-ownUKKZ8euYEtJBuQ9YQw8nXH9uJqX8VlhV9UQfa5Gio7ZzLjELBGT6mUNT9VNk9HBEhbpMpSP8vmbkzCDYnK_JAgUZZXWu6FPOZyoF5MGMY6wTxljS1izHcUaOhiziAOuSQab2Hn7CDE55J-hV-LKSxg1GbCUMMnhVJQ4gbtwu37U6ruL5UkSoaGARWsXcAzCggaFtIrhsozwbu07fv-0NKNeqjHKaEBw5oNTNexevNNMKS-5G6WOvq4ke-ksrxByF_6daVWGm3y5Ki2EvVZypCUIaB3RSGuUHNC8IX4T8NET0ZbsaTF9lpDJHsnIkvzjwxzZ4a8hFaE17L_9IH8bDJESs6vVTl3p4dfZBB2c2xMW7FGopP4FlbTl5NIG45bFjZYaO9Oz3dLZQUpYcGW4O3uruirER7HVbq01JzgujjrmQ7dOy_PXR1qBqJL3GpIvxEu1Ho_O95kNFeN9WyW5VjQ47TMbvxe6pD_56onfIcsWG7a6niO3xllDL4UESuDGQ724YAxYyJ4JyYzSpkAAsOfBSfZnkcxq3dm9ejbgSqTPiKb-FdqZPatuRyp1lsVdjxxYVVijNccKFXC8N_BIkbgL4MQkoSYfmDISYzlP4dSTRXwtrMfTDtKPS81o2mhFBCfpjhwl8znZF3MxPjdcH5_7MSguDmVPKK3wgcQvAkBLFUSg_SMPTWIYUu7BW0egjdkJmg30jDKftolKcl11vzr74jYbnuvf_QQnzUACkvQNjxg9lKUz43LXZF7vpnNvLFDt2-Z8LZo9zrlVeQy8oJUMlw7iN2VCrTpMOpqNSof3TNEAgXOfijWak3A13J6HIazn7Wn2U6h9RgH-FaQ4oq8ED9X_yJIgJGnyiuhQu_sRDGGlUsU-Y7991d36tpOwvNP03ErtoDkJ7NLo_qKaayyhADGddfqTTgrk2qfyu96YpVQ4c0XRSd1eABaBvO7Us84UgV_wobk-h_oSdLwri57HJMHElIT11iPlrHhWmjjJTxyFJcuqiVA5JDkgzeQ7Y9BEzbz1vVk9dh29kJab6GODCWFEXXZsEMTdVOlsgyZLlb0AZd_2LttxZo4InH8K5P_F1dc5SWHN3xIhBEBIbjlVvCl2hfQbjQTiPkYB68zy_8xGenTqFp3HGjcIkL3CxDdXbumKTCWnVZHOzhJpGmqoo-xxbS2u1pFkqY37WjueOtme_FEIsEwQdU7EEC9hSMoNRDUA7np3KytOFyqKSj89twhIzg"

    def __init__(self, email: str, password: str, with_logs: bool = False):
        self.email = Email()
        self.email.address = email
        self.email.get_token(password)
        self.email.start(self.__listener)

        self._code = None
        self._auth = None
        self.with_logs = with_logs

    def __listener(self, message):
        message_time = parser.parse(message["createdAt"]).astimezone().replace(tzinfo=None)
        if message_time < datetime.now() - timedelta(seconds=5):
            return

        content = message["subject"]

        pattern = r"Your confirmation code is: (\d+)"
        matches = re.search(pattern, content)

        if matches:
            self._code = matches.group(1)

        self.email.listen = None
        if self.with_logs:
            print("Your confirmation code is:", self._code)

    def __send(self, endpoint: str, **kwargs):
        if self.with_logs:
            print(f"Send request to {endpoint}. With params: {kwargs}.")
        kwargs["headers"] = {
            "Authorization": f"Bearer {self._auth}",
            "Origin": "https://pwa.bondex.app",

        }

        response = requests.post(
            self.base_url + endpoint,
            **kwargs
        )
        if self.with_logs:
            print(endpoint, response.status_code, response.text)
        response.raise_for_status()
        return response

    def _validate(self):
        self.__send(
            "Authentication/validate",
            data={
                "value": self.email.address,
                "token": self.token,
            }
        )

    def _sign_in(self):
        response = self.__send(
            "Authentication/signin",
            data={
                "value": self.email.address,
                "code": self._code,
            }
        )
        self._auth = response.json()["data"]

    def _boost(self):
        response = self.__send("dashboard/boost")
        print(f"{self.email.address} boostEndTime - {response.json()['data']['endTime']}")

    def _extend(self):
        self.__send("dashboard/extend")

    def boost(self) -> None:
        self._validate()

        wait = 0
        while self._code is None and self.email.thread.is_alive():
            if wait >= MAX_WAIT:
                raise Exception("Timeout")
            wait += 1
            sleep(1)

        self._sign_in()
        self._extend()
        self._boost()


def booster():
    location = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db", "db.json")
    with open(location) as data:
        content = json.load(data)
        for user in content["users"]:
            try:
                print("Start boosting:", user["username"])
                worker = BondexBooster(
                    email=user["username"],
                    password=user["password"],
                )
                worker.boost()
                print("Boosted", user["username"])
            except Exception as error:
                print("Error:", error)


if __name__ == "__main__":
    booster()
