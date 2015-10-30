<p>I'm Matt Gaunt a Senior Developer Advocate @ Google.
I generally work on the open web these days, but used
to be a full time mobile software engineer.</p>

<ul class="about__fact-list">
  <li class="about__fact-list-item">
    <div class="about__fact-list-title small-font-size">
      Facts
    </div>
    <div class="about__fact-list-content">
      <ul>
        <li>Graduated from Bristol way back when.</li>
        <li>Love playing the guitar.</li>
        <li>Enjoying hardware hacking, although I'm hella new to it.</li>
      </ul>
    </div>
  </li>
  <?php if (isset($latestPost)) {?>
  <li class="about__fact-list-item small-font-size">
    <div class="about__fact-list-title">
      Blog
    </div>
    <div class="about__fact-list-content">
      <p>Check out my blog, the latest was titled "<a href="<?php echo(htmlspecialchars($latestPost->getPublicURL())); ?>"><?php echo($latestPost->getTitle()); ?></a>"</p>
    </div>
  </li>
  <?php } ?>
  <li class="about__fact-list-item">
    <div class="about__fact-list-title small-font-size">
      Shout
    </div>
    <div class="about__fact-list-content">
      <p>I'm on <a href="<?php echo(htmlspecialchars('#')); ?>">Twitter</a>, <a href="<?php echo(htmlspecialchars('#')); ?>">G+</a> and you can
      always <a href="<?php echo(htmlspecialchars('#')); ?>">drop me an email</a>. <a href="<?php echo(htmlspecialchars('#')); ?>">Twitter</a> is
      probably the best way to get in touch.</p>
    </div>
  </li>
</ul>
