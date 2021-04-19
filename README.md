## deploy
  
```sls deploy```

## test with python

```python
import requests


def send_sms_message():
  r = requests.post(
    url="https://l3wj2fm8mh.execute-api.us-east-1.amazonaws.com/dev/sendMessage",
    json={"phoneNumber": "+001123456789", "message": "test sms message"},
  )
  print(r.json())


send_sms_message()
```