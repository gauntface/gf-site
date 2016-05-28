<?php
/*
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

class Google_Service_AdExchangeBuyer_PublisherProfileApiProto extends Google_Collection
{
  protected $collection_key = 'topHeadlines';
  public $accountId;
  public $buyerPitchStatement;
  public $googlePlusLink;
  public $isParent;
  public $kind;
  public $logoUrl;
  public $mediaKitLink;
  public $name;
  public $overview;
  public $profileId;
  public $publisherDomains;
  public $rateCardInfoLink;
  public $samplePageLink;
  public $topHeadlines;

  public function setAccountId($accountId)
  {
    $this->accountId = $accountId;
  }
  public function getAccountId()
  {
    return $this->accountId;
  }
  public function setBuyerPitchStatement($buyerPitchStatement)
  {
    $this->buyerPitchStatement = $buyerPitchStatement;
  }
  public function getBuyerPitchStatement()
  {
    return $this->buyerPitchStatement;
  }
  public function setGooglePlusLink($googlePlusLink)
  {
    $this->googlePlusLink = $googlePlusLink;
  }
  public function getGooglePlusLink()
  {
    return $this->googlePlusLink;
  }
  public function setIsParent($isParent)
  {
    $this->isParent = $isParent;
  }
  public function getIsParent()
  {
    return $this->isParent;
  }
  public function setKind($kind)
  {
    $this->kind = $kind;
  }
  public function getKind()
  {
    return $this->kind;
  }
  public function setLogoUrl($logoUrl)
  {
    $this->logoUrl = $logoUrl;
  }
  public function getLogoUrl()
  {
    return $this->logoUrl;
  }
  public function setMediaKitLink($mediaKitLink)
  {
    $this->mediaKitLink = $mediaKitLink;
  }
  public function getMediaKitLink()
  {
    return $this->mediaKitLink;
  }
  public function setName($name)
  {
    $this->name = $name;
  }
  public function getName()
  {
    return $this->name;
  }
  public function setOverview($overview)
  {
    $this->overview = $overview;
  }
  public function getOverview()
  {
    return $this->overview;
  }
  public function setProfileId($profileId)
  {
    $this->profileId = $profileId;
  }
  public function getProfileId()
  {
    return $this->profileId;
  }
  public function setPublisherDomains($publisherDomains)
  {
    $this->publisherDomains = $publisherDomains;
  }
  public function getPublisherDomains()
  {
    return $this->publisherDomains;
  }
  public function setRateCardInfoLink($rateCardInfoLink)
  {
    $this->rateCardInfoLink = $rateCardInfoLink;
  }
  public function getRateCardInfoLink()
  {
    return $this->rateCardInfoLink;
  }
  public function setSamplePageLink($samplePageLink)
  {
    $this->samplePageLink = $samplePageLink;
  }
  public function getSamplePageLink()
  {
    return $this->samplePageLink;
  }
  public function setTopHeadlines($topHeadlines)
  {
    $this->topHeadlines = $topHeadlines;
  }
  public function getTopHeadlines()
  {
    return $this->topHeadlines;
  }
}
