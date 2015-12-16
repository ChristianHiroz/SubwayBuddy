<?php

namespace SubwayBuddy\UserBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use SubwayBuddy\UserBundle\Entity\Travel;
use SubwayBuddy\UserBundle\Form\TravelType;

/**
 * Travel controller.
 *
 * @Route("/travel")
 */
class TravelController extends Controller
{

    /**
     * Lists all Travel entities.
     *
     * @Route("/", name="travel")
     * @Method("GET")
     * @Template()
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $entities = $em->getRepository('SubwayBuddyUserBundle:Travel')->findAll();

        return array(
            'entities' => $entities,
        );
    }
    /**
     * Creates a new Travel entity.
     *
     * @Route("/", name="travel_create")
     * @Method("POST")
     * @Template("SubwayBuddyUserBundle:Travel:new.html.twig")
     */
    public function createAction(Request $request)
    {
        $entity = new Travel();
        $form = $this->createCreateForm($entity);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($entity);
            $em->flush();

            return $this->redirect($this->generateUrl('travel_show', array('id' => $entity->getId())));
        }

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Creates a form to create a Travel entity.
     *
     * @param Travel $entity The entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createCreateForm(Travel $entity)
    {
        $form = $this->createForm(new TravelType(), $entity, array(
            'action' => $this->generateUrl('travel_create'),
            'method' => 'POST',
        ));

        $form->add('submit', 'submit', array('label' => 'Create'));

        return $form;
    }

    /**
     * Displays a form to create a new Travel entity.
     *
     * @Route("/new", name="travel_new")
     * @Method("GET")
     * @Template()
     */
    public function newAction()
    {
        $entity = new Travel();
        $form   = $this->createCreateForm($entity);

        return array(
            'entity' => $entity,
            'form'   => $form->createView(),
        );
    }

    /**
     * Finds and displays a Travel entity.
     *
     * @Route("/{id}", name="travel_show")
     * @Method("GET")
     * @Template()
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('SubwayBuddyUserBundle:Travel')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Travel entity.');
        }

        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
     * Displays a form to edit an existing Travel entity.
     *
     * @Route("/{id}/edit", name="travel_edit")
     * @Method("GET")
     * @Template()
     */
    public function editAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('SubwayBuddyUserBundle:Travel')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Travel entity.');
        }

        $editForm = $this->createEditForm($entity);
        $deleteForm = $this->createDeleteForm($id);

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }

    /**
    * Creates a form to edit a Travel entity.
    *
    * @param Travel $entity The entity
    *
    * @return \Symfony\Component\Form\Form The form
    */
    private function createEditForm(Travel $entity)
    {
        $form = $this->createForm(new TravelType(), $entity, array(
            'action' => $this->generateUrl('travel_update', array('id' => $entity->getId())),
            'method' => 'PUT',
        ));

        $form->add('submit', 'submit', array('label' => 'Update'));

        return $form;
    }
    /**
     * Edits an existing Travel entity.
     *
     * @Route("/{id}", name="travel_update")
     * @Method("PUT")
     * @Template("SubwayBuddyUserBundle:Travel:edit.html.twig")
     */
    public function updateAction(Request $request, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $entity = $em->getRepository('SubwayBuddyUserBundle:Travel')->find($id);

        if (!$entity) {
            throw $this->createNotFoundException('Unable to find Travel entity.');
        }

        $deleteForm = $this->createDeleteForm($id);
        $editForm = $this->createEditForm($entity);
        $editForm->handleRequest($request);

        if ($editForm->isValid()) {
            $em->flush();

            return $this->redirect($this->generateUrl('travel_edit', array('id' => $id)));
        }

        return array(
            'entity'      => $entity,
            'edit_form'   => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        );
    }
    /**
     * Deletes a Travel entity.
     *
     * @Route("/{id}", name="travel_delete")
     * @Method("DELETE")
     */
    public function deleteAction(Request $request, $id)
    {
        $form = $this->createDeleteForm($id);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $entity = $em->getRepository('SubwayBuddyUserBundle:Travel')->find($id);

            if (!$entity) {
                throw $this->createNotFoundException('Unable to find Travel entity.');
            }

            $em->remove($entity);
            $em->flush();
        }

        return $this->redirect($this->generateUrl('travel'));
    }

    /**
     * Creates a form to delete a Travel entity by id.
     *
     * @param mixed $id The entity id
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm($id)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('travel_delete', array('id' => $id)))
            ->setMethod('DELETE')
            ->add('submit', 'submit', array('label' => 'Delete'))
            ->getForm()
        ;
    }
}
