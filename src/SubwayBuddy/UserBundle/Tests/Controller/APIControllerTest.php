<?php

namespace SubwayBuddy\UserBundle\Tests\Controller;

use Liip\FunctionalTestBundle\Test\WebTestCase as WebTestCase;

class APIControllerTest extends WebTestCase
{
    public function testWorkingMatchingAction(){
        $client = static::createClient();

        $client->request('GET', '/api/matchings/1', array('ACCEPT' => 'application/json'));

        $response = $client->getResponse();

        $this->assertJsonResponse($response,200);

        $content = $response->getContent();

        $decoded = json_decode($content, true);

        foreach($decoded as $userdecoded){
            $this->assertTrue(isset($userdecoded['id']));
            $this->assertTrue(isset($userdecoded['name']));
            $this->assertTrue(isset($userdecoded['subjects']));
        }
    }

    public function testNoMatchingAction(){
        $client = static::createClient();

        $client->request('GET', '/api/matchings/4', array('ACCEPT' => 'application/json'));

        $response = $client->getResponse();

        $this->assertJsonResponse($response,404);

        $excepted = "Aucuns matchs.";
        $content = $response->getContent();
        $message = json_decode($content, true);
        $this->assertJsonMessage($message['error']['message'],$excepted);
    }

    public function testNotExistTravelMatchingAction(){
        $client = static::createClient();

        $client->request('GET', '/api/matchings/4', array('ACCEPT' => 'application/json'));

        $response = $client->getResponse();

        $this->assertJsonResponse($response,404);

        $excepted = "SubwayBuddyUserBundle:Travel object not found.";
        $content = $response->getContent();
        $message = json_decode($content, true);
        $this->assertJsonMessage($message['error']['message'],$excepted);
    }

    public function testBuddyAction(){
        $client = static::createClient();

        $client->request('GET', '/api/buddies/1', array('ACCEPT' => 'application/json'));

        $response = $client->getResponse();

        $this->assertJsonResponse($response,200);

        $content = $response->getContent();

        $userdecoded = json_decode($content, true);

        $this->assertTrue(isset($userdecoded[0]['id']));
        $this->assertTrue(isset($userdecoded[0]['username']));
        $this->assertTrue(isset($userdecoded[0]['username_canonical']));
        $this->assertTrue(isset($userdecoded[0]['email']));
        $this->assertTrue(isset($userdecoded[0]['email_canonical']));
        $this->assertTrue(isset($userdecoded[0]['enabled']));
        $this->assertTrue(isset($userdecoded[0]['salt']));
        $this->assertTrue(isset($userdecoded[0]['password']));
        $this->assertTrue(isset($userdecoded[0]['locked']));
        $this->assertTrue(isset($userdecoded[0]['expired']));
        $this->assertTrue(isset($userdecoded[0]['roles']));
        $this->assertTrue(isset($userdecoded[0]['credentials_expired']));
    }

    public function testEmptyBuddyAction(){
        $client = static::createClient();

        $client->request('GET', '/api/buddies/2', array('ACCEPT' => 'application/json'));

        $response = $client->getResponse();

        $this->assertJsonResponse($response,404);

        $excepted = "Pas d'amis, prend un curly!";
        $content = $response->getContent();
        $message = json_decode($content, true);
        $this->assertJsonMessage($message['error']['message'],$excepted);
    }

    public function testNotExistUserBuddyAction(){
        $client = static::createClient();

        $client->request('GET', '/api/buddies/42', array('ACCEPT' => 'application/json'));

        $response = $client->getResponse();

        $this->assertJsonResponse($response,404);

        $excepted = "SubwayBuddyUserBundle:User object not found.";
        $content = $response->getContent();
        $message = json_decode($content, true);
        $this->assertJsonMessage($message['error']['message'],$excepted);
    }



    protected function assertJsonMessage($message,$excepted){
        if($message == $excepted){
            return true;
        }
        else{
            return false;
        }
    }

    protected function assertJsonResponse($response, $statusCode = 200, $checkValidJson =  true, $contentType = 'application/json')
    {
        $this->assertEquals(
            $statusCode, $response->getStatusCode(),
            $response->getContent()
        );
        $this->assertTrue(
            $response->headers->contains('Content-Type', $contentType),
            $response->headers
        );
        if ($checkValidJson) {
            $decode = json_decode($response->getContent());
            $this->assertTrue(($decode != null && $decode != false),
                'is response valid json: [' . $response->getContent() . ']'
            );
        }
    }
}
