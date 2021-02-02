import sinon from 'sinon';

before(function () {
  this.sandbox = sinon.createSandbox();
});

after(function () {
  (this.sandbox as sinon.SinonSandbox).restore();
});
