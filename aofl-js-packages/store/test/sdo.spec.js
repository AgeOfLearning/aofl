import {Sdo} from '../modules/sdo';
import {Store} from '../modules/store';
import {state, decorate} from '../modules/decorators';

describe('@aofl/store/sdo', function() {
  beforeEach(/** @this */ function() {
    this.storeInstance = new Store();

    class TodoSdo extends Sdo {
      static namespace = 'todos';

      @state()
      todos = [];

      addTodo(todo) {
        return [
          ...this.todos,
          todo
        ];
      }

      @decorate('todos.todos')
      get doneTodos() {
        return this.todos.filter((item) => item.status === 'done');
      }
    }

    this.TodoSdo = TodoSdo;
    this.todoSdo = new TodoSdo(void 0, this.storeInstance);
    this.storeInstance.addState(this.todoSdo);
    sinon.spy(this.storeInstance, 'commit');
  });

  afterEach(/** @this */function() {
    this.storeInstance.commit.restore();
  });

  it('Should return state from store', /** @this */ function() {
    expect(this.todoSdo.state).to.equal(this.storeInstance.state.todos);
  });

  it('Should proxy state properties from storeInstance', /** @this */ function() {
    expect(this.todoSdo.todos).to.equal(this.storeInstance.state.todos.todos);
  });

  it('Should return decorated value', /** @this */ function() {
    this.todoSdo.todos = [
      {id: 0, text: 'todo 0', status: 'done'},
      {id: 1, text: 'todo 1', status: 'new'}
    ];

    expect(this.todoSdo.doneTodos).to.have.property('length', 1);
  });

  it('Should return decorated value', /** @this */ function() {
    this.todoSdo.todos = [
      {id: 0, text: 'todo 0', status: 'done'},
      {id: 1, text: 'todo 1', status: 'new'}
    ];
    this.todoSdo.doneTodos;
    expect(this.todoSdo.doneTodos).to.have.property('length', 1);
  });

  it('Should notify subscribers once', /** @this */ function(done) {
    const stub = sinon.stub();
    const unsub = this.storeInstance.subscribe(stub);

    this.todoSdo.todos = [];
    this.todoSdo.todos = [];

    setTimeout(() => {
      unsub();
      expect(stub.calledOnce).to.be.true;
      done();
    }, 100);
  });

  context('SDO#commit()', function() {
    it('Should invoke commit from storeInstance', /** @this */ function() {
      this.todoSdo.commit({todos: []});
      expect(this.storeInstance.commit.called).to.be.true;
    });
  });

  context('SDO#reset()', function() {
    it('Should invoke commit from storeInstance', /** @this */ function() {
      this.todoSdo.reset();
      expect(this.storeInstance.commit.called).to.be.true;
    });

    it('Should reset state to initial state', /** @this */ function() {
      this.todoSdo.todos = [{id: 1, text: 'some todo', status: 'new'}];
      this.todoSdo.reset();
      expect(this.storeInstance.state.todos.todos).to.be.eql([]);
    });

    it('Should reset all sdos', /** @this */ function() {
      this.todoSdo.todos = [{id: 1, text: 'some todo', status: 'new'}];
      this.storeInstance.flushState();

      expect(this.storeInstance.state.todos.todos).to.be.eql([]);
    });
  });
});
