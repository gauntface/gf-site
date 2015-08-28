<div id="mocha"></div>

<script src="https://cdn.rawgit.com/jquery/jquery/2.1.4/dist/jquery.min.js"></script>
<script src="https://cdn.rawgit.com/Automattic/expect.js/0.3.1/index.js"></script>
<script src="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.js"></script>

<script>mocha.setup('bdd')</script>
<script src="/scripts/tests/test.base-controller.es6.js"></script>

<script>
  mocha.checkLeaks();
  mocha.globals(['jQuery', 'GauntFace', 'GoogleAnalyticsObject', 'ga', 'gaplugins', 'gaGlobal']);
  mocha.run();
</script>
