<?php

namespace SubwayBuddy\UserBundle\Controller;

use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\RequestParam;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\FOSRestController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use SubwayBuddy\UserBundle\Entity\User;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\View\View as Vieww;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Templating\TemplateReference;

class UserController extends FOSRestController
{
    /**
     * @return array
     * @View()
     */
    public function getUsersAction()
    {
        $userManager = $this->container->get('fos_user.user_manager');
        $entity = $userManager->findUsers();
        if (!$entity) {
            throw $this->createNotFoundException('Data not found.');
        }
        $view = Vieww::create();
        $view->setData($entity)->setStatusCode(200);
        return $view;
    }

    /**
     * @param User $user
     * @return array
     * @View()
     * @ParamConverter("user", class="SubwayBuddyUserBundle:User")
     */
    public function getUserAction(User $user)
    {
        return array('user' => $user);
    }

    /**
     * Create a User from the submitted data.<br/>
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="username", nullable=false, strict=true, description="Username.")
     * @RequestParam(name="email", nullable=false, strict=true, description="Email.")
     * @RequestParam(name="password", nullable=false, strict=true, description="Plain Password.")
     * @Post
     *
     * @return View
     */
    public function postUserAction(ParamFetcher $paramFetcher)
    {
        $userManager = $this->container->get('fos_user.user_manager');
        $user = $userManager->createUser();
        $user->setUsername($paramFetcher->get('username'));
        $user->setEmail($paramFetcher->get('email'));
        $user->setPlainPassword($paramFetcher->get('password'));
        $user->setEnabled(true);
        $user->addRole('ROLE_API');
        $view = Vieww::create();
        $errors = $this->get('validator')->validate($user, array('Registration'));
        if (count($errors) == 0) {
            $userManager->updateUser($user);
            $view->setData($user)->setStatusCode(200);
            return $view;
        } else {
            $view = $this->getErrorsView($errors);
            return $view;
        }
    }

    /**
     * Login a User from the submitted data.<br/>
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="username", nullable=false, strict=true, description="Username.")
     * @RequestParam(name="password", nullable=false, strict=true, description="Plain Password.")
     * @Post
     *
     * @return View
     */
    public function loginUserAction(ParamFetcher $paramFetcher)
    {

        $username = $paramFetcher->get('username');
        $password = $paramFetcher->get('password');

        return $this->container->get('subwaybuddy_user.user_service')->login($username, $password);
    }

}
