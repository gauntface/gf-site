<?php
    header("Content-Type: application/rss+xml; charset=utf-8");

    $rssfeed = '<?xml version="1.0" encoding="utf-8"?>'."\r\n";
    $rssfeed .= '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">'."\r\n";
    $rssfeed .= '<channel>'."\r\n";
    $rssfeed .= '<title>Gaunt Face | Matt Gaunt</title>'."\r\n";
    $rssfeed .= '<link>'.base_url().'</link>'."\r\n";
    $rssfeed .= '<description>I\'m Matt Gaunt a Senior Developer Advocate @ Google. I generally work on the open web these days, but used to be a full time mobile software engineer.</description>'."\r\n";
    $rssfeed .= '<language>en-uk</language>'."\r\n";
    $rssfeed .= '<copyright>Copyright (C) '.date("Y").' gauntface.com</copyright>'."\r\n";
    $rssfeed .= '<atom:link href="'.current_url().'" rel="self" type="application/rss+xml" />'."\r\n";
    for($i = 0; $i < count($posts); $i++) {
        $post = $posts[$i];
        $rssfeed .= '<item>'."\r\n";
        $rssfeed .= '<title>'.'<![CDATA['."\r\n".$post->getTitle()."\r\n";
        $rssfeed .= ']]>'."\r\n".'</title>'."\r\n";
        $rssfeed .= '<description>'."\r\n";
        $rssfeed .= '<![CDATA['."\r\n".$post->getExcerptHTML()."\r\n".']]>'."\r\n";
        $rssfeed .= '</description>'."\r\n";

        $itemUrl = base_url().'blog/'.date("Y", $post->getPublishTime()).'/'.date("m", $post->getPublishTime()).'/'.date("d", $post->getPublishTime()).'/'.$post->getSlug();

        $rssfeed .= '<link>' . $itemUrl . '</link>'."\r\n";
        // TODO Change to slug
        //$rssfeed .= '<guid isPermaLink="false">' . base_url().'blog/'.$post['id'] . '</guid>'."\r\n";

        $rssfeed .= '<pubDate>' . date("D, d M Y H:i:s O", $post->getPublishTime()) . '</pubDate>'."\r\n";
        $rssfeed .= '</item>'."\r\n";
    }
    $rssfeed .= '</channel>'."\r\n";
    $rssfeed .= '</rss>';

    echo $rssfeed;
?>
