import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <section className='container text-[#18181B]'>
      <div className='w-full mt-10 mb-8'>
        <h1 className='font-semibold text-[30px]'>Dashboard</h1>
      </div>
      <div className="flex h-screen text-[Inter]">
        <aside className="w-1/4 flex flex-col gap-1.5text-[14px]">
          <button className='button-sidebar'>
            Subscriptions
          </button>
          <button className='button-sidebar'>
            Payments
          </button>
        </aside>
        <div className="flex-1 bg-gray-100">
          <h1 className="text-2xl font-bold">Основной контент</h1>
          <p>Здесь находится основной контент сайта.</p>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;