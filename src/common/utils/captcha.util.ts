import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { redisStore } from "@store/index";
import { PROJECT, CHECK_CAPTCHA } from '@config/env';

const svgCaptcha = require('svg-captcha');

class Captcha {

  public async create() {
    const { data, text } = svgCaptcha.create({
      ignoreChars: '0o1i',
      color: true,
      width: 120,
      height: 48
    });

    const token = uuidv4();
    await redisStore.setex(`${PROJECT}:captcha:${token}`, text, 300);
    return { token, data };
  }

  public async check(token: string, text: string) {
    if (!CHECK_CAPTCHA)
      return true;

    const key = `${PROJECT}:captcha:${token}`;
    const ret = await redisStore.get(key);
    if (_.isNil(ret) || _.isEmpty(ret))
      return false;

    const match = text.toUpperCase() === ret.toUpperCase();
    if (!match)
      await redisStore.del(key);

    return match;  
  }

}

export const captchas = new Captcha();
