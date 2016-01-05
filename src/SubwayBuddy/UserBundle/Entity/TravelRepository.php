<?php

namespace SubwayBuddy\UserBundle\Entity;

/**
 * TravelRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class TravelRepository extends \Doctrine\ORM\EntityRepository
{
    public function match(Travel $travel){
        $em = $this->getEntityManager();
        $query = $em->createQuery(
        'Select IDENTITY(t.user)
            From SubwayBuddyUserBundle:Travel t
            WHERE t.name = ?1
            AND t.time LIKE ?2
            AND t.user != ?3');

        $query->setParameter(1,$travel->getName());
        $query->setParameter(2,$travel->getTime());
        $query->setParameter(3,$travel->getUser());

        return $query->getResult();
    }
}
