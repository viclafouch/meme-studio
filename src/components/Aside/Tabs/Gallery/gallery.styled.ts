import styled from 'styled-components'

export default {
  GalleryContainer: styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
  GalleryScrollable: styled.div`
    overflow-y: auto;
  `,
  GalleryList: styled.ul`
    padding: 0 0.3125rem;
    list-style: none;
    width: 100%;
    background-color: #f3f1f1;
  `,
  GalleryListItem: styled.li`
    display: block;
  `,
  ItemLink: styled.a`
    display: block;
  `
}
