import React, { useState } from 'react';
import moment from 'moment';
import './PsychologistAccount.css';
import { useLocation } from 'react-router-dom';
import PageLayout from '../../components/templates/PageLayout/PageLayout';
import NavLinksList from '../../components/NavLinksList/NavLinksList';
import {
  PSYCHOLOGIST_ACCOUNT_LINKS,
  PSYCHOLOGIST_ACCOUNT_TITLES,
  DATE_FORMAT,
} from '../../constants/constants';
import { SLOTS } from '../../constants/db';
import BlockWithTitle from '../../components/templates/BlockWithTitle/BlockWithTitle';
import Calendar from '../../components/Сalendar/Сalendar';
import CardOfSession from '../../components/Cards/CardOfSession/CardOfSession';
import SessionPlanner from '../../components/SessionPlanner/SessionPlanner';
import SlotsList from '../../components/SlotsList/SlotsList';
import Title from '../../components/generic/Title/Title';

export default function PsychologistAccount() {
  const [currentDay, setCurrentDay] = useState(moment());
  let nextAppointment = null;
  const selectedSlots = [];
  const path = useLocation().pathname.split('_').pop();

  const getNextSession = () => {
    if (selectedSlots.length > 0) {
      nextAppointment = selectedSlots.reduce((acc, cur) => {
        if (
          moment(cur.slot.datetime_from, DATE_FORMAT).isBefore(
            moment(acc.slot.datetime_from, DATE_FORMAT)
          ) && selectedSlots.client // prettier-ignore
        ) {
          return cur;
        }
        return acc;
      });

      nextAppointment.datetime_from = nextAppointment.slot.datetime_from;
      nextAppointment.datetime_to = nextAppointment.slot.datetime_to;
    }
  };

  const getSheduleCurrentDay = () => {
    if (SLOTS.length > 0) {
      for (let i = 0; i < SLOTS.length; i += 1) {
        const timeSession = moment(SLOTS[i].slot.datetime_from, DATE_FORMAT);
        if (timeSession.isSame(currentDay, 'day') && timeSession.isAfter(moment())) {
          selectedSlots.push(SLOTS[i]);
        }
      }
      getNextSession();
    }
  };

  getSheduleCurrentDay();

  return (
    <PageLayout
      title={PSYCHOLOGIST_ACCOUNT_TITLES[path].pageTitle}
      isLoggedIn
      nav={<NavLinksList list={PSYCHOLOGIST_ACCOUNT_LINKS} direction="column" variant="violet" />}
    >
      <section className="psychologist-account">
        {path !== 'profile' ? (
          <>
            <BlockWithTitle title={PSYCHOLOGIST_ACCOUNT_TITLES[path].calendarTitle}>
              <Calendar onDateCellClick={setCurrentDay} />
            </BlockWithTitle>

            <BlockWithTitle title={PSYCHOLOGIST_ACCOUNT_TITLES[path].reminderTitle}>
              {path !== 'schedule' ? (
                <CardOfSession session={nextAppointment} />
              ) : (
                <SessionPlanner />
              )}
            </BlockWithTitle>
          </>
        ) : null}

        {path !== 'profile' ? (
          <SlotsList sessions={selectedSlots} selectedDay={currentDay} />
        ) : (
          <Title text="ПРОФИЛЬ ЗДЕСЬ" />
        )}
      </section>
    </PageLayout>
  );
}
