import {AoflElement} from '../modules/aofl-element';
import {customElement, property} from '../modules/decorators';
import {Sdo, state, storeInstance} from '@aofl/store';
import {html, render} from 'lit-html';
import {expect} from 'chai';

class CountSdo extends Sdo {
  static namespace = 'count';

  @state()
  count = 0;

  increment() {
    this.commit({
      count: this.count + 1
    });
  }
}

const countSdo = new CountSdo();
storeInstance.addState(countSdo);

@customElement('decorator-element')
class DecoratorElement extends AoflElement { // eslint-disable-line
  static is = 'decorator-element';

  @property({mapState: 'count.count', store: storeInstance})
  count = 0;

  render() {
    return super.render((ctx, html) => html`${ctx.count}`);
  }
}

describe('@aofl/element/decorators', function() {
  beforeEach( /** @this */ function() {
    this.countSdo = countSdo;
    this.testContainer = getTestContainer();
    render(html`
      <decorator-element id="decorator-element"></styled-element>
    `, this.testContainer);

    this.element = this.testContainer.querySelector('#decorator-element');
  });

  afterEach(/** @this */ function() {
    cleanTestContainer(this.testContainer);
  });

  it('Should map property from state', /** @this */ function(done) {
    countSdo.increment();

    setTimeout(() => {
      expect(this.element.count).to.be.equal(1);
      done();
    }, 20);
  });


  it('Should not throw an error when trying to register another element with the same tagname', /** @this */ function() {
    const goodFn = () => {
      @customElement('decorator-element')
      class OtherElement {} // eslint-disable-line
    };

    expect(goodFn()).to.not.throw;
  });
});
