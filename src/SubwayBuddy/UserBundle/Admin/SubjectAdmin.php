<?php

namespace SubwayBuddy\UserBundle\Admin;

use Sonata\AdminBundle\Admin\Admin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class SubjectAdmin extends Admin
{

    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('subject', 'text', array('label' => 'Sujet'))
            ->add('number', 'date', array('label' => 'Priorité'));
    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('id', null, array('label' => 'Identifiant'))
            ->add('subject', '', array('label' => 'Sujet'))
            ->add('number', 'date', array('label' => 'Priorité'))
        ;
    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('id', null , array('label' => 'Identifiant'))
            ->add('subject', '', array('label' => 'Sujet'))
            ->add('number', 'date', array('label' => 'Priorité'))
        ;
    }
}