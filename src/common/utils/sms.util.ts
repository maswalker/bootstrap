import _ from 'lodash';
import axios  from 'axios'
import urlencode from 'urlencode';

async function sendSms(params: {
  key: string;
  secret: string;
  phone: string;
  content: string;
}) {
  const { key, secret, phone, content } = params;
  const url = `http://utf8.api.smschinese.cn/?Uid=${key}&Key=${secret}&smsMob=${phone}&smsText=${urlencode(content)}`;
  const response = await axios.get(url);
  return _.get(response, 'data') == 1;
}

export { sendSms };
