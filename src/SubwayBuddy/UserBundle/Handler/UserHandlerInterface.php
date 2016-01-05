<?php
/**
 * Created by PhpStorm.
 * User: AppleJack
 * Date: 27/11/2015
 * Time: 11:07
 */

namespace SubwayBuddy\UserBundle\Handler;


Interface UserHandlerInterface
{
    public function login($username, $password);
}
