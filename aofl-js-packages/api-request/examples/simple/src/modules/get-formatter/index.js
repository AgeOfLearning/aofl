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

export default GetFormatter;
