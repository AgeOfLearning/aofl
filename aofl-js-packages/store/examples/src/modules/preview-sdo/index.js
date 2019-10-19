import {Sdo, decorate, state, storeInstance} from '@aofl/store';

const config = {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
};

class PreviewSdo extends Sdo {
  static namespace = 'preview';
  @state() count = 0;
  @state() date = Date.now();

  increment() {
    this.count += 1;
  }

  @decorate('preview.date')
  get formattedDate() {
    return new Date(this.date).toLocaleDateString('en-US', config);
  }
}

const previewSdo = new PreviewSdo();
storeInstance.addState(previewSdo);

export {
  previewSdo
};
