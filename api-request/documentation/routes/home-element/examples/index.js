/* eslint-disable */
context.memes = [];

class GetFormatter {
  static pack() {
    const headers = new Headers();

    headers.append('Accept', '*/*');

    return {
      method: 'GET',
      headers,
      mode: 'cors'
    };
  }

  static unpack(response) {
    return response.json()
    .then((data) => {
      if (data.success === false) {
        return Promise.reject(data);
      }
      return data;
    });
  }
}

const apiRequestInstance = new ApiRequest();
apiRequestInstance.addFormatter('get', GetFormatter);

context.makeRequest = () => {
  apiRequestInstance.request('https://api.imgflip.com/get_memes', void 0, 'get')
  .then((response) => {
    context.memes = response.data.memes;
  });
};
