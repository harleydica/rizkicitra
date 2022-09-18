import Label from '@/components/atoms/Label'
import UnstyledLink from '@/components/atoms/UnstyledLink'

import { Blogs } from '@/data/blog/blog.type'
import { numberToCompact } from '@/libs/numberFormat'
import { twclsx } from '@/libs/twclsx'

import { HiOutlineClock, HiOutlineEye } from 'react-icons/hi'

interface BlogCardProps extends Blogs {
  displayViews?: boolean
}

const BlogCard: React.FunctionComponent<BlogCardProps> = ({ title, topics, ...props }) => {
  return (
    <div className={twclsx('relative flex flex-col p-3 h-full', 'bg-theme-50 dark:bg-theme-900')}>
      <h3 className={twclsx('mb-2 md:mb-4')}>{title}</h3>
      <div className={twclsx('flex items-center justify-between mt-auto w-full')}>
        {topics.length > 0 && (
          <div className={twclsx('flex items-center space-x-2 md:space-x-3')}>
            {topics.map((topic, index) => (
              <Label type={topic} key={topic + index} />
            ))}
          </div>
        )}
        <div className={twclsx('flex flex-col', 'gap-2', 'text-sm')}>
          {props.displayViews && props.views ? (
            <p className='inline-flex items-center gap-2.5'>
              <HiOutlineEye />
              <span>{numberToCompact(props.views ?? 0)}</span>
            </p>
          ) : null}
          <p className='inline-flex items-center gap-2.5'>
            <HiOutlineClock />
            <span>{props.est_read?.replace('read', '')}</span>
          </p>
        </div>
      </div>

      <UnstyledLink className={twclsx('absolute inset-0')} href={'/blog/' + props.slug} title={title}>
        <span className={twclsx('sr-only')}>Read blog abot {title}</span>
      </UnstyledLink>
    </div>
  )
}

export default BlogCard
