<?php

namespace SubwayBuddy\UserBundle\Entity;

/**
 * UserRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class UserRepository extends \Doctrine\ORM\EntityRepository
{
    public function match(Travel $travel){

        $em = $this->getEntityManager();
        $query = $em->createQuery(
            'Select IDENTITY(t.user)
            From SubwayBuddyUserBundle:Travel t
            WHERE t.name = ?1
            AND t.user != ?2
            AND YEAR(t.time) = ?3
            AND MONTH(t.time) = ?4
            AND DAY(t.time) = ?5');


        $day = $travel->getTime()->format('d');
        $year = $travel->getTime()->format('Y');
        $month = $travel->getTime()->format('m');
//        $hour = $travel->getTime()->format('h'); TODO

        $query->setParameter(1,$travel->getName());
        $query->setParameter(2,$travel->getUser());
        $query->setParameter(3,$year);
        $query->setParameter(4,$month);
        $query->setParameter(5,$day);
//        $query->setParameter(6,$hour); TODO

        $result =  $query->getResult();


        $subjects = $travel->getUser()->getSubjects();

        $array = array();
        foreach($result as $user){
            $user = $this->find($user[1]);
            $userSubjects = $user->getSubjects();
            $match = false;
            foreach($userSubjects as $subject){
                if($subjects->contains($subject)) $match = true;
            }
            if($match){
                $array[] = $user;
            }
        }

        return $result;
    }
}
