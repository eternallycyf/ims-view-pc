import { CustomTooltip, ScrollHorizontalCard } from 'ims-view-pc'

const Demo = () => {
  return (
    <div style={{ maxWidth: 400 }}>
      <ScrollHorizontalCard<{
        title: string;
        descriptions: string;
        key: string;
      }> items={Array.from({ length: 10 }).map((ele, index) => ({
        title: '测试',
        descriptions: '测试'.repeat(200),
        key: String(index)
      }))}
        minWidth={50}
        renderItem={(item) => <CustomTooltip.Paragraph rows={1} content={item?.title} />}
      />
    </div>
  )
}

export default Demo