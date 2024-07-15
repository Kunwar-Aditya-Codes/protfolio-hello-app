import { cn } from '@/lib/utils';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  ArrowRight,
  ChevronRight,
  LaptopMinimal,
  Smartphone,
  Star,
} from 'lucide-react';
import { Pacifico } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import {
  RiTwitterXFill,
  RiFacebookFill,
  RiInstagramFill,
} from 'react-icons/ri';

const pacifico = Pacifico({ subsets: ['latin'], weight: ['400'] });

const FEATURES = [
  { name: 'Fast & Reliable' },
  { name: 'Secure Encryption' },
  { name: 'File Sharing' },
  { name: 'Seamless Experience' },
];

const FOOTER_LINKS = [
  {
    tName: 'Useful links',
    links: [
      { lName: 'About us' },
      { lName: 'Features' },
      { lName: 'Terms & Conditions' },
      { lName: 'Company Profile' },
    ],
  },
  {
    tName: 'Content',
    links: [
      { lName: 'Home' },
      { lName: 'Beta tester' },
      { lName: 'Join official group' },
    ],
  },
  {
    tName: 'Contact Us',
    links: [
      { lName: 'hello.app@gmail.com' },
      { lName: '012-245-7777' },
      { lName: 'Social Media' },
      { lName: 'Unsubscribe mail' },
    ],
  },
];

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const sessionUser = await getUser();

  return (
    <main className='bg-orange-600/5 dark:bg-orange-950 overflow-x-hidden'>
      <section className='h-[100dvh] flex flex-col w-full'>
        {/* Navbar */}
        <nav className='max-w-7xl w-full mx-auto p-6 flex items-center justify-between'>
          <div>
            <h1
              className={cn(
                'text-4xl font-black text-orange-500 lowercase tracking-wider ',
                pacifico.className
              )}
            >
              Hello!
            </h1>
          </div>
          <ul>
            {sessionUser?.id ? (
              <Link
                href={'/dashboard'}
                className=' rounded-full bg-orange-500 text-white  hover:bg-orange-600 uppercase tracking-wide transition-colors px-[1.5rem] py-3 text-sm'
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href={'/api/auth/login'}
                className=' rounded-full bg-orange-500 text-white  hover:bg-orange-600 uppercase tracking-wide transition-colors px-[1.5rem] py-3 text-sm'
              >
                Login
              </Link>
            )}
          </ul>
        </nav>

        {/* Hero */}
        <div className='mt-8 max-w-7xl md:grid grid-cols-8 mx-auto px-6 pt-6 gap-x-4  grow'>
          <div className='grid md:block h-full md:text-wrap w-full col-span-3'>
            <h1 className=' text-4xl sm:text-5xl text-center md:text-left lg:text-6xl font-black lg:leading-[5.3rem] text-zinc-900'>
              <span className={cn('text-orange-500')}>Connect</span> with your
              circle in a fun way !
            </h1>
            <p className='text-center md:text-justify mt-8 text-zinc-800'>
              Experience seamless real-time communication with our intuitive web
              chat app. Connect with friends, family, and colleagues
              effortlessly, whether you are at home or on the go. Fast, secure,
              and user-friendly—start chatting today!
            </p>

            <div className='mt-10 flex flex-col items-center space-y-6 md:space-y-0  md:flex-row md:space-x-6'>
              <Link
                href={'/api/auth/register'}
                className=' shadow-md bg-white text-orange-500 px-3 py-2  tracking-wide font-medium  sm:px-6 sm:py-4 rounded-full sm:text-lg flex items-center justify-between space-x-4 w-fit'
              >
                Get Started
                <ArrowRight className='size-4 ml-2' />
              </Link>

              <div className='flex items-center space-x-4 text-muted-foreground'>
                <Smartphone className='size-6 mb-0.5' />
                <LaptopMinimal className='size-7' />
              </div>
            </div>
          </div>

          <div className='hidden col-span-5 md:flex justify-end overflow-hidden  h-full'>
            <Image
              src={'/hero2.png'}
              alt='hero-image'
              width={500}
              height={500}
              className='object-contain xl:object-cover w-fit'
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className='max-w-7xl mx-auto bg-white rounded-2xl shadow p-6'>
          <h1 className='font-bold tracking-wide text-xl uppercase text-zinc-900'>
            Features
          </h1>
          <div className='mt-8 grid gap-y-4  md:grid-cols-4 justify-items-center'>
            {FEATURES.map((feature, i) => (
              <div key={i}>
                <img
                  src={`./f${i + 1}.jpg`}
                  alt=''
                  className='aspect-square object-cover w-[11rem] rounded-3xl object-center'
                />
                <p className='mt-2 text-center text-zinc-600 font-medium'>
                  {feature.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='mt-16'>
        <div className='max-w-7xl mx-auto bg-white rounded-2xl shadow p-6'>
          <h1 className='font-bold tracking-wide text-xl uppercase text-zinc-900'>
            Testimonials
          </h1>
          <div className='p-8 mt-4'>
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4  w-fit p-6 rounded-full md:shadow-lg'>
              <div className='flex -space-x-4'>
                <img
                  className='inline-block size-10 rounded-full ring-2 ring-slate-100'
                  src={'/t1.jpg'}
                  alt='user image'
                />
                <img
                  className='inline-block size-10 rounded-full ring-2 ring-slate-100'
                  src={'/t2.jpg'}
                  alt='user image'
                />
                <img
                  className='inline-block size-10 rounded-full ring-2 ring-slate-100'
                  src={'/t3.jpg'}
                  alt='user image'
                />
                <img
                  className='inline-block size-10 rounded-full ring-2 ring-slate-100'
                  src={'/t4.jpg'}
                  alt='user image'
                />
              </div>

              <div className='flex flex-col justify-between items-center sm:items-start'>
                <div className='flex gap-0.5'>
                  <Star className='size-4 text-orange-500 fill-orange-500 ' />
                  <Star className='size-4 text-orange-500 fill-orange-500 ' />
                  <Star className='size-4 text-orange-500 fill-orange-500 ' />
                  <Star className='size-4 text-orange-500 fill-orange-500 ' />
                  <Star className='size-4 text-orange-500 fill-orange-500 ' />
                </div>
                <p>
                  <span className='font-semibold'>1,250</span> happy Customers.
                </p>
              </div>
            </div>

            <div className='mt-8 md:grid grid-cols-8 gap-3'>
              <div className='col-span-5 grid gap-3'>
                <div className='bg-blue-600 text-white p-4 rounded-2xl rounded-br-none'>
                  <p className=''>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Aliquam libero esse totam aut fuga reiciendis perspiciatis
                    nostrum. Itaque, ducimus voluptas expedita omnis possimus
                    accusantium alias.
                  </p>
                </div>
                <div className='sm:grid grid-cols-5 gap-3'>
                  <div className='col-span-3 bg-sky-700 text-white p-4 rounded-2xl rounded-br-none'>
                    <p>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                      Temporibus voluptas porro tempora assumenda nihil
                      doloribus blanditiis dolore rem, aliquam quo. Dignissimos
                      mollitia itaque consequatur. Totam impedit dicta eius
                      libero ipsa.
                    </p>
                  </div>
                  <div className=' mt-4 sm:mt-0 col-span-2 bg-amber-600 text-white p-4 rounded-2xl rounded-br-none'>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Ipsam esse placeat veniam assumenda ea sit voluptas
                      inventore atque asperiores ratione.
                    </p>
                  </div>
                </div>
                <div className='sm:grid grid-cols-9 gap-3'>
                  <div className='col-span-3 bg-sky-600 text-white p-4 rounded-2xl rounded-br-none'>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Itaque quasi sed vel expedita eveniet sapiente!
                    </p>
                  </div>
                  <div className=' mt-4 sm:mt-0 col-span-3 bg-rose-600 text-white p-4 rounded-2xl rounded-br-none'>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Blanditiis reiciendis pariatur ab architecto corrupti?
                      Ullam? asdas asdasdasda
                    </p>
                  </div>
                  <div className='mt-4 sm:mt-0 col-span-3 bg-violet-600 text-white p-4 rounded-2xl rounded-br-none'>
                    <p>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Accusantium at quo unde doloremque delectus et ratione
                      modi nulla.
                    </p>
                  </div>
                </div>
              </div>
              <div className='hidden col-span-3 md:grid gap-3'>
                <div className='bg-purple-600 text-white p-4 rounded-2xl rounded-br-none'>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et
                    nostrum enim ipsa nihil minima repellat doloribus
                    necessitatibus exercitationem vitae tempore amet
                    voluptatibus nobis, dolores, eum officia nulla provident
                    dolorem labore possimus placeat nesciunt voluptate
                    voluptates unde? Quam voluptas odit culpa molestiae
                    recusandae ducimus minima temporibus. Magnam similique
                    tempore adipisci sit aut iusto sequi, eum ratione omnis
                    repudiandae temporibus qui explicabo minus corporis
                    molestias optio cumque, quo laboriosam hic quibusdam
                    reiciendis excepturi suscipit quaerat. Facere, quo saepe
                    placeat culpa tempora blanditiis?
                  </p>
                </div>
                <div className='bg-orange-600 text-white p-4 rounded-2xl rounded-br-none'>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Error earum corrupti eveniet dignissimos veniam minus
                    tempore doloribus, fuga nulla ullam, molestias labore quas
                    voluptatibus iste!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-white mt-12'>
        <div className='max-w-7xl flex flex-col lg:flex-row space-y-16 lg:space-y-0 items-start  lg:space-x-28 md:justify-between mx-auto p-6 pb-12'>
          <div className='lg:flex-[0.4]'>
            <div className=''>
              <h1
                className={cn(
                  'text-4xl font-black text-orange-500 lowercase tracking-wider ',
                  pacifico.className
                )}
              >
                Hello!
              </h1>
              <p className='text-justify mt-6 text-zinc-800'>
                Experience seamless real-time communication with our intuitive
                web chat app. Connect with friends, family, and colleagues
                effortlessly, whether you are at home or on the go. Fast,
                secure, and user-friendly—start chatting today!
              </p>

              <div className='mt-16 flex items-center space-x-6'>
                <RiTwitterXFill
                  className='size-5
                '
                />
                <RiFacebookFill
                  className='size-5
                '
                />
                <RiInstagramFill
                  className='size-5
                '
                />
              </div>
            </div>
          </div>
          <div className=' lg:flex-[0.6] w-full  grid grid-cols-2 gap-16 sm:grid-cols-3 lg:px-4'>
            {FOOTER_LINKS.map((option) => (
              <div className='' key={option.tName}>
                <h4 className='text-lg font-bold '>{option.tName}</h4>
                <p className='grid gap-y-8 mt-4 text-sm'>
                  {option.links.map((link) => (
                    <span key={link.lName} className='flex items-center'>
                      <ChevronRight className='size-4 mr-2' />
                      {link.lName}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className='max-w-7xl mx-auto p-6 border-t flex items-center justify-between gap-x-4'>
          <p className='text-xs sm:text-sm text-zinc-700 font-medium'>
            Created by{' '}
            <a
              href='https://github.com/Kunwar-Aditya-Codes'
              target='_blank'
              className='underline underline-offset-2 text-zinc-900'
            >
              Kunwar Aditya
            </a>
          </p>
          <p className='text-xs sm:text-sm text-zinc-500'>
            Design inspired by{' '}
            <a
              href='https://dribbble.com/shots/19280608-Halodek-Chat-Mobile-App-Landing-Page'
              target='_blank'
              className='underline  underline-offset-2 text-zinc-700'
            >
              Zhofran Ardyan
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
