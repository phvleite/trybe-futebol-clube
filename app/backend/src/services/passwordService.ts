import * as bcrypt from 'bcryptjs';

const passwordService = {
  encryptPassword: (password: string) => {
    const salt = bcrypt.genSaltSync(8);
    const encryptedPassword = bcrypt.hashSync(password, salt);
    return encryptedPassword;
  },

  comparePassword: (password: string, hash: string) => {
    const comp = bcrypt.compareSync(password, hash);
    return comp;
  },
};

export default passwordService;
