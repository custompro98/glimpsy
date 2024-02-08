import Link from "next/link";
import { list } from "./actions";
import { getServerSession } from "next-auth";
import Icon from "@mdi/react";
import { mdiDelete, mdiPencil } from "@mdi/js";

enum SearchParamKeys {
  PAGE = "page",
}

interface SearchParams {
  [SearchParamKeys.PAGE]: string;
}

export default async function Images({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return (
      <div>
        Please <Link href="/api/auth/signin">sign in</Link>
      </div>
    );
  }

  const page = parseInt(searchParams[SearchParamKeys.PAGE] || "1");
  const listResults = await list(session.user.email, { page });

  return (
    <section className="container">
      <div className="field is-grouped is-grouped-right">
        <Link href="/glimps/new" className="button is-primary">
          Create
        </Link>
      </div>
      <div className="table-container">
        <table className="table is-striped is-hoverable is-fullwidth">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Background Color</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {listResults.records.map((image) => {
              return (
                <tr key={image.og_images.id}>
                  <th scope="row">{image.og_image_blog.title}</th>
                  <td>{image.og_image_blog.backgroundColor}</td>
                  <td>
                    <Link href={image.og_image_blog.icon}>Avatar</Link>
                  </td>
                  <td>
                    <span className="icon">
                      <Icon path={mdiPencil} size={1} />
                    </span>
                    <span className="icon">
                      <Icon path={mdiDelete} size={1} />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(listResults.hasPrev && (
          <button className="button">
            <Link href={`/glimps?page=${page - 1}`}>Prev</Link>
          </button>
        )) || <div></div>}
        {(listResults.hasNext && (
          <button className="button">
            <Link href={`/glimps?page=${page + 1}`}>Next</Link>
          </button>
        )) || <div></div>}
      </div>
    </section>
  );
}