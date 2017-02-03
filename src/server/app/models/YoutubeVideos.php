<?php

namespace app\models;

use lithium\analysis\Logger;
use lithium\storage\Cache;

class YoutubeVideos extends \lithium\data\Model {

  protected $_meta = [
		'connection' => false
	];

  public static function getLatestVideo() {
    $videoInfo = Cache::read('default', 'latest_video');
    if ($videoInfo) {
      return $videoInfo;
    }

    try {
      $TTT_PLAYLIST_ID = 'PLNYkxOF6rcIB3ci6nwNyLYNU6RDOU3YyL';
      $client = new \Google_Client();
      $client->setDeveloperKey(getenv('YOUTUBE_API_KEY'));
      $youtube = new \Google_Service_YouTube($client);
      $playlistItemsResponse = $youtube->playlistItems->listPlaylistItems('snippet', array(
        'playlistId' => $TTT_PLAYLIST_ID,
        'maxResults' => 3
      ));

      for ($i = 0; $i < count($playlistItemsResponse->items); $i++) {
        $origTitle = $playlistItemsResponse->items[$i]->snippet->title;
        if (strpos(strtolower($origTitle), 'trailer') === false) {
          preg_match ('/((?:,|in|:)?\s*Totally\s*Tooling\s*Tips.*)/', $origTitle, $matches);
          $reducedTitle = str_replace($matches[1], '', $origTitle);
          $videoSnippet = $playlistItemsResponse->items[$i]->snippet;
          $videoInfo = array(
            'title' => $reducedTitle,
            'url' => 'https://www.youtube.com/watch?v='.$videoSnippet->resourceId->videoId.'&list='.$TTT_PLAYLIST_ID
          );
          break;
        }
      }

      $written = Cache::write('default', 'latest_video', $videoInfo, 24 * 60 * 60);
      if (!$written) {
        Logger::warning("Latest video cache failed.");
      }
    } catch(Exception $e) {
      // Unable to get tweet
      Logger::error("Unable to retrieve latest youtube video: ". $e->getMessage());
    }

    return $videoInfo;
  }
}

?>
