<?php

namespace SubwayBuddy\UserBundle\Controller;

use FOS\RestBundle\Controller\FOSRestController;
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
        $em = $this->getDoctrine()->getManager();

        $users = $em->getRepository('SubwayBuddyUserBundle:User')->findAll();

        return array('users' => $users);
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
     * Display the form.
     *
     * @return Form form instance
     *
     */
    public function newUserAction()
    {
        $form = $this->container->get('fos_user.registration.form.factory')->createForm();
        $view = Vieww::create()
            ->setData(array('form' => $form->createView()))
            ->setTemplate(new TemplateReference('SubwayBuddyUserBundle', 'User', 'new'));
        return $this->getViewHandler()->handle($view);
    }

    /**
     * @return \FOS\RestBundle\View\ViewHandler
     */
    private function getViewHandler()
    {
        return $this->container->get('fos_rest.view_handler');
    }
}
