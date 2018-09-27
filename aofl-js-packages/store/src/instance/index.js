import Store from '../Store';

export default new Store(process.env.NODE_ENV === 'development');

