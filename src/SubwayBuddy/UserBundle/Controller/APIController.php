<?php

namespace SubwayBuddy\UserBundle\Controller;

use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\RequestParam;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\FOSRestController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use SubwayBuddy\UserBundle\Entity\Subject;
use SubwayBuddy\UserBundle\Entity\Travel;
use SubwayBuddy\UserBundle\Entity\User as User;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\View\View as Vieww;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Templating\TemplateReference;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Validator\Constraints\DateTime;

class APIController extends FOSRestController
{
    //<editor-fold desc="Travel">
    /**
     * Create Travel
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="name", nullable=false, strict=true, description="Travel name.")
     * @RequestParam(name="time", nullable=false, strict=true, description="Travel date.")
     * @RequestParam(name="user", nullable=false, strict=true, description="User id.")
     * @Post
     * @View()
     *
     * @return View
     */
    public function travelAction(ParamFetcher $paramFetcher)
    {

        $name = $paramFetcher->get('name');
        $time = $paramFetcher->get('time');
        $user = $paramFetcher->get('user');

        $em = $this->getDoctrine()->getManager();

        $user =  $em->getRepository('SubwayBuddyUserBundle:User')->find($user);


        $travel = new Travel();
        $travel->setName($name);

        $time = new \DateTime($time);
        $travel->setTime($time);
        $travel->setUser($user);
        $user->addTravel($travel);

        $em->persist($travel);
        $em->flush();

        $view = Vieww::create();

        $view->setData($travel)->setStatusCode(200);

        return $view;
    }

    /**
     * @return array
     * @View()
     */
    public function getTravelsAction()
    {

        $em = $this->getDoctrine()->getManager();
        $entity  =  $em->getRepository('SubwayBuddyUserBundle:Travel')->findAll();
        if (!$entity) {
            throw $this->createNotFoundException('Data not found.');
        }
        $view = Vieww::create();
        $view->setData($entity)->setStatusCode(200);
        return $view;
    }

    /**
     * @param Travel $travel
     * @return array
     * @View()
     * @ParamConverter("travel", class="SubwayBuddyUserBundle:Travel")
     */
    public function getTravelAction(Travel $travel)
    {
        return array('travel' => $travel);
    }

    /**
     * @param Travel $travel
     * @return array
     * @View()
     * @ParamConverter("user", class="SubwayBuddyUserBundle:User")
     */
    public function getUserTravelAction(User $user)
    {
        $em = $this->getDoctrine()->getManager();
        $entity  =  $em->getRepository('SubwayBuddyUserBundle:Travel')->findBy(array('user' => $user));
        if (!$entity) {
            throw $this->createNotFoundException('Data not found.');
        }
        $view = Vieww::create();
        $view->setData($entity)->setStatusCode(200);
        return $view;
    }
    //</editor-fold>

    //<editor-fold desc="Subject">
    /**
     * Create Subject
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="subject", nullable=false, strict=true, description="Subject to discuss.")
     * @RequestParam(name="number", nullable=false, strict=true, description="Priority for the subject.")
     * @RequestParam(name="travel", nullable=false, strict=true, description="Travel id.")
     * @Post
     * @View()
     *
     * @return View
     */
    public function postSubjectAction(ParamFetcher $paramFetcher)
    {

        $subjectP = $paramFetcher->get('subject');
        $number = $paramFetcher->get('number');
        $travel = $paramFetcher->get('travel');

        $em = $this->getDoctrine()->getManager();

        try{
            $travel =  $em->getRepository('SubwayBuddyUserBundle:Travel')->find($travel);
        }
        catch(Exception $e){

        }


        $subject = new Subject();
        $subject->setNumber($number);
        $subject->setSubject($subjectP);
        $subject->setTravel($travel);

        $travel->addSubject($subject);

        $em->persist($subject);
        $em->flush();

        $view = Vieww::create();

        $view->setData($subject)->setStatusCode(200);

        return $view;
    }

    /**
     * @return array
     * @View()
     */
    public function getSubjectsAction()
    {

        $em = $this->getDoctrine()->getManager();
        $entity  =  $em->getRepository('SubwayBuddyUserBundle:Subject')->findAll();
        if (!$entity) {
            throw $this->createNotFoundException('Data not found.');
        }
        $view = Vieww::create();
        $view->setData($entity)->setStatusCode(200);
        return $view;
    }

    /**
     * @param Subject $subject
     * @return array
     * @View()
     * @ParamConverter("subject", class="SubwayBuddyUserBundle:Subject")
     */
    public function getSubjectAction(Subject $subject)
    {
        return array('subject' => $subject);
    }

    /**
     * @param Subject $subject
     * @return array
     * @View()
     * @ParamConverter("travel", class="SubwayBuddyUserBundle:Travel")
     */
    public function getTravelSubjectAction(Travel $travel)
    {
        $em = $this->getDoctrine()->getManager();
        $entity  =  $em->getRepository('SubwayBuddyUserBundle:Subject')->findBy(array('travel' => $travel));
        if (!$entity) {
            throw $this->createNotFoundException('Data not found.');
        }
        $view = Vieww::create();
        $view->setData($entity)->setStatusCode(200);
        return $view;
    }
    //</editor-fold>

    //<editor-fold desc="User">
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
    //</editor-fold>
}
