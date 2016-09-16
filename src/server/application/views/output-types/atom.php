<?php
    header("Content-Type: application/atom+xml; charset=utf-8");

    $rssfeed = '<?xml version="1.0" encoding="utf-8"?>'."\r\n";
    $rssfeed .= '<feed xmlns="http://www.w3.org/2005/Atom">'."\r\n";
    $rssfeed .= '<title>Gaunt Face | Matt Gaunt</title>'."\r\n";
    $rssfeed .= '<link href="'.htmlspecialchars(current_url()).'" rel="self" />'."\r\n";
    $rssfeed .= '<id>'.base_url().'/blog/feed/atom</id>'."\r\n";
    $rssfeed .= '<subtitle>I\'m Matt Gaunt, a developer currently at Google. Here are my ramblings.</subtitle>'."\r\n";
    $rssfeed .= '<rights>Copyright (C) '.date("Y").' gauntface.com</rights>'."\r\n";
    if (count($posts) > 0) {
      $rssfeed .= '<updated>' . date(DateTime::RFC3339, $posts[0]->getPublishTime()) . '</updated>'."\r\n";
    }

    for($i = 0; $i < count($posts); $i++) {
        $post = $posts[$i];
        $rssfeed .= '<entry>'."\r\n";
        $rssfeed .= '<title type="html"><![CDATA['.$post->getTitle().']]></title>'."\r\n";
        $rssfeed .= '<summary type="html"><![CDATA['.$post->getExcerptHTML().']]></summary>'."\r\n";
        $rssfeed .= '<content type="html"><![CDATA['.$post->getContentHTML().']]></content>'."\r\n";
        $rssfeed .= '<author><name>'.$post->getAuthor().'</name></author>'."\r\n";

        $itemUrl = rtrim(base_url(), "/").$post->getPublicURL();

        $rssfeed .= '<link href="'.$itemUrl.'" />'."\r\n";
        $rssfeed .= '<id>'.$itemUrl.'</id>'."\r\n";

        $rssfeed .= '<published>' . date(DateTime::RFC3339, $post->getPublishTime()) . '</published>'."\r\n";
        $rssfeed .= '<updated>' . date(DateTime::RFC3339, $post->getPublishTime()) . '</updated>'."\r\n";
        $rssfeed .= '</entry>'."\r\n";
    }
    $rssfeed .= '</feed>';

    echo $rssfeed;
?>
