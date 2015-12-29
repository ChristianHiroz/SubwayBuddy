<?php

namespace SubwayBuddy\UserBundle\Entity;

/**
 * SubjectRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class SubjectRepository extends \Doctrine\ORM\EntityRepository
{
    public function match(Subject $subject){
        $em = $this->getEntityManager();
        $query = $em->createQuery(
            'Select IDENTITY(s.user)
            From SubwayBuddyUserBundle:Subject s
            WHERE s.subject = ?1
            AND s.user != ?2');

        $query->setParameter(1,$subject->getSubject());
        $query->setParameter(2,$subject->getUser());

        return $query->getResult();
    }
}
