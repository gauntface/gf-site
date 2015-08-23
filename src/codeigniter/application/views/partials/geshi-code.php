<h1>GeSHi Code Example</h1>

<div class="geshi_highlight__container">
<div class="geshi_highlight">&nbsp; &nbsp; <span class="kw1">function</span> compileSassAutoprefix<span class="br0">(</span>genSourceMaps<span class="br0">)</span> <span class="br0">{</span><br>
&nbsp; &nbsp; &nbsp; <span class="kw1">return</span> gulp.<span class="me1">src</span><span class="br0">(</span><span class="br0">[</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span class="co1">// TODO: This seems to speed up ever so slighty - maybe move imports</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span class="co1">// to a seperate repo to improve further by only including</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span class="co1">// a src of files we KNOW we want sass plugin to explore</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span class="st0">'!'</span> &nbsp; DIR.<span class="me1">src</span>.<span class="me1">styles</span> &nbsp; <span class="st0">'/**/_*.scss'</span><span class="sy0">,</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; DIR.<span class="me1">src</span>.<span class="me1">styles</span> &nbsp; <span class="st0">'/**/*.scss'</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; <span class="br0">]</span><span class="br0">)</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; .<span class="me1">pipe</span><span class="br0">(</span>plugins.<span class="kw1">if</span><span class="br0">(</span>genSourceMaps<span class="sy0">,</span> plugins.<span class="me1">sourcemaps</span>.<span class="me1">init</span><span class="br0">(</span><span class="br0">)</span><span class="br0">)</span><span class="br0">)</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; .<span class="me1">pipe</span><span class="br0">(</span>plugins.<span class="me1">sass</span><span class="br0">(</span><span class="br0">{</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; precision<span class="sy0">:</span> <span class="nu0">10</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; <span class="br0">}</span><span class="br0">)</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; .<span class="me1">on</span><span class="br0">(</span><span class="st0">'error'</span><span class="sy0">,</span> plugins.<span class="me1">sass</span>.<span class="me1">logError</span><span class="br0">)</span><span class="br0">)</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; .<span class="me1">pipe</span><span class="br0">(</span>plugins.<span class="me1">autoprefixer</span><span class="br0">(</span>AUTOPREFIXER_BROWSERS<span class="br0">)</span><span class="br0">)</span><span class="sy0">;</span><br>
&nbsp; &nbsp; <span class="br0">}</span><br>
<br>
&nbsp; &nbsp; gulp.<span class="me1">task</span><span class="br0">(</span><span class="st0">'generate-dev-css'</span><span class="sy0">,</span> <span class="br0">[</span><span class="st0">'styles:clean'</span><span class="br0">]</span><span class="sy0">,</span> <span class="kw1">function</span><span class="br0">(</span><span class="br0">)</span> <span class="br0">{</span><br>
&nbsp; &nbsp; &nbsp; <span class="kw1">return</span> compileSassAutoprefix<span class="br0">(</span><span class="kw2">true</span><span class="br0">)</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; .<span class="me1">pipe</span><span class="br0">(</span>plugins.<span class="me1">sourcemaps</span>.<span class="me1">write</span><span class="br0">(</span><span class="br0">)</span><span class="br0">)</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; .<span class="me1">pipe</span><span class="br0">(</span>gulp.<span class="me1">dest</span><span class="br0">(</span>DIR.<span class="me1">build</span>.<span class="me1">styles</span><span class="br0">)</span><span class="br0">)</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; .<span class="me1">pipe</span><span class="br0">(</span>plugins.<span class="me1">size</span><span class="br0">(</span><span class="br0">{</span>title<span class="sy0">:</span> <span class="st0">'generate-dev-css'</span><span class="br0">}</span><span class="br0">)</span><span class="br0">)</span><span class="sy0">;</span><br>
&nbsp; &nbsp; <span class="br0">}</span><span class="br0">)</span><span class="sy0">;</span><br>
<br>
&nbsp; &nbsp; gulp.<span class="me1">task</span><span class="br0">(</span><span class="st0">'generate-prod-css'</span><span class="sy0">,</span> <span class="br0">[</span><span class="st0">'styles:clean'</span><span class="br0">]</span><span class="sy0">,</span> <span class="kw1">function</span><span class="br0">(</span><span class="br0">)</span> <span class="br0">{</span><br>
&nbsp; &nbsp; &nbsp; <span class="kw1">return</span> compileSassAutoprefix<span class="br0">(</span><span class="kw2">false</span><span class="br0">)</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; .<span class="me1">pipe</span><span class="br0">(</span>plugins.<span class="kw1">if</span><span class="br0">(</span><span class="st0">'*.css'</span><span class="sy0">,</span> plugins.<span class="me1">csso</span><span class="br0">(</span><span class="br0">)</span><span class="br0">)</span><span class="br0">)</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; .<span class="me1">pipe</span><span class="br0">(</span>gulp.<span class="me1">dest</span><span class="br0">(</span>DIR.<span class="me1">build</span>.<span class="me1">styles</span><span class="br0">)</span><span class="br0">)</span><br>
&nbsp; &nbsp; &nbsp; &nbsp; .<span class="me1">pipe</span><span class="br0">(</span>plugins.<span class="me1">size</span><span class="br0">(</span><span class="br0">{</span>title<span class="sy0">:</span> <span class="st0">'generate-css'</span><span class="br0">}</span><span class="br0">)</span><span class="br0">)</span><span class="sy0">;</span><br>
&nbsp; &nbsp; <span class="br0">}</span><span class="br0">)</span><span class="sy0">;</span></div>
</div>
