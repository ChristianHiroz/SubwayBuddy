<?php

namespace SubwayBuddy\UserBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends \PHPUnit_Framework_TestCase
{
    public function testLoginUserAction()
    {
        $hp = new \HttpRequest();

        $hp->setContentType("application/x-www-form-urlencoded");
        $hp->setUrl("christian-hiroz.com/SubwayBuddy/web/app_dev.php/users/login");
        $hp->setBody("name=cricri&password=cricri");

        $result = $hp->send();

        $this->assertEquals(0,$result);
    }
}
