<?php

namespace SubwayBuddy\UserBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class TravelAdmin extends Admin
{

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('name', 'text', array('label' => 'Nom du trajet'))
            ->add('time', 'date', array('label' => 'Horaire du trajet'))
            ->add('user', 'sonata_type_model', array('label' => 'Utilisateur'))
            ->add('subjects', 'sonata_type_model', array('label' => 'Sujets de discussion', 'by_reference' => true,'multiple' => true,'required' => false));
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id', null, array('label' => 'Identifiant'))
            ->add('name', '', array('label' => 'Nom du trajet'))
            ->add('time', 'date', array('label' => 'Horaire du trajet'))
        ;
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id', null , array('label' => 'Identifiant'))
            ->add('name', '', array('label' => 'Nom du trajet'))
            ->add('time', 'date', array('label' => 'Horaire du trajet'))
        ;
    }
}