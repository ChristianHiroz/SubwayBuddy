<?php

namespace SubwayBuddy\UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

class LandingController extends Controller
{
    /**
     * @Route("/")
     * @Template()
     */
    public function indexAction()
    {

        return array(
                // ...
            );
    }

    /**
     * @Route("/ws")
     * @Template()
     */
    public function wsAction()
    {
        return array(
                // ...

                );
    }


}
