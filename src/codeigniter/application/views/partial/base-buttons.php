<h1>This is &lt;button&gt;</h1>

<p>
  <button>Button</button>

  <button><img src="<?php echo(base_url().'images/example/test.png'); ?>" /></button>

  <button><?php include('images/example/test.svg'); ?></button>
</p>

<h2>Disabled</h2>

<p>
  <button disabled>Button</button>

  <button disabled><img src="<?php echo(base_url().'images/example/test.png'); ?>" /></button>

  <button disabled><?php include('images/example/test.svg'); ?></button>
</p>

<h1>This is button class="transparent"</h1>

<button class="transparent">Button</button>

<button class="transparent"><img src="<?php echo(base_url().'images/example/test.png'); ?>" /></button>

<button class="transparent"><?php include('images/example/test.svg'); ?></button>

<h2>Disabled</h2>

<button class="transparent" disabled>Button</button>

<button class="transparent" disabled><img src="<?php echo(base_url().'images/example/test.png'); ?>" /></button>

<button class="transparent" disabled><?php include('images/example/test.svg'); ?></button>

<h1>This is anchor class="btn"</h1>

<a class="btn"><img src="<?php echo(base_url().'images/example/test.png'); ?>" /></a>

<a class="btn"><?php include('images/example/test.svg'); ?></a>

<h1>This is anchor class="btn image-text"</h1>

<a class="btn image-text">
  <img src="<?php echo(base_url().'images/example/test.png'); ?>" />
  <span>An 'img' Anchor</span>
</a>

<a class="btn image-text"><?php include("images/example/test.svg"); ?>An 'svg' Anchor</a>

<h1>This is &lt;input&gt;</h1>

<input type="submit" value="Submit" />
