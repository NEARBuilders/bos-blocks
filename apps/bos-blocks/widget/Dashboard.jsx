/**
 * TODO
 *
 * - [ ] add compose for feed, it shares the same "item", but uses a different "set" adapter (Social.index vs Social.set)
 * - [ ]
 *
 */

const { Feed } = VM.require("devs.near/widget/Feed") || (() => {});
const { Create } = VM.require("devs.near/widget/Create") || (() => {});

const accountId = context.accountId;

const myFeeds = JSON.parse(
  Social.get(`${context.accountId}/settings/every/feed`, "final") || "null"
);

function getPersonalizedIndex() {
  if (myFeeds) {
    return myFeeds.map((feed) => {
      return {
        action: feed.action,
        key: feed.key,
        options: {
          limit: 10,
          order: "desc",
          accountId: undefined,
        },
        cacheOptions: {
          ignoreCache: true,
        },
      };
    });
  } else {
    return [];
  }
}

const availableFeeds = [
  {
    name: "main",
    description: "Main feed",
    type: "social",
    postTemplate: "devs.near/widget/Post",
    props: {
      index: [
        {
          action: "post",
          key: "main",
          options: {
            limit: 10,
            order: "desc",
            accountId: undefined,
          },
          cacheOptions: {
            ignoreCache: true,
          },
        },
        {
          action: "repost",
          key: "main",
          options: {
            limit: 10,
            order: "desc",
            accountId: undefined,
          },
          cacheOptions: {
            ignoreCache: true,
          },
        },
      ],
    },
  },
  {
    name: "#dev",
    description: "hashtag feed",
    type: "social",
    postTemplate: "devs.near/widget/Post",
    props: {
      index: {
        action: "hashtag",
        key: "dev",
        options: {
          limit: 10,
          order: "desc",
          accountId: undefined,
        },
        cacheOptions: {
          ignoreCache: true,
        },
      },
    },
  },
  {
    name: "embeds",
    description: "embeds feed",
    type: "social",
    postTemplate: "embeds.near/widget/Post.Index",
    props: {
      index: {
        action: "post",
        key: "main",
        options: {
          limit: 10,
          order: "desc",
          accountId: ["efiz.near"],
        },
      },
    },
  },
  {
    name: "personalized",
    description: "personalized feed",
    type: "social",
    postTemplate: "mob.near/widget/N.Post",
    props: {
      index: getPersonalizedIndex(),
    },
  },
];

const defaultFeed = availableFeeds[0];
const [selectedFeed, setSelectedFeed] = useState(defaultFeed);
const [showCreate, setShowCreate] = useState(!selectedFeed);

const toggleShowCreate = () => {
  setShowCreate(!showCreate);
};

function Content({ data }) {
  const { props, postTemplate } = data;
  return (
    <div key={data.name} className="border p-4 rounded">
      {showCreate ? (
        <Create />
      ) : (
        <Feed
          index={props.index}
          Item={({ accountId, path, blockHeight, type }) => {
            return (
              <Widget
                src={postTemplate}
                props={{
                  accountId,
                  path,
                  blockHeight,
                  type,
                }}
                loading={<div className="w-100" style={{ height: "200px" }} />}
              />
            );
          }}
          Layout={Grid}
        />
      )}
    </div>
  );
}

return (
  <div className="container py-4">
    <div className="navbar">
      <Link className="navbar-brand" to="/devs.near/widget/Dashboard">
        <h1 className="display-1">every feed</h1>
      </Link>
    </div>
    <div className="row">
      <div className="col-md-3 p-4">
        <div className="d-flex flex-column gap-2">
          <button
            className="bg-primary text-white p-2 rounded"
            onClick={toggleShowCreate}
          >
            create
          </button>
          {availableFeeds.map((it, index) => (
            <button
              key={index}
              className="bg-secondary text-white rounded"
              onClick={() => setSelectedFeed(it)}
            >
              {it.name}
            </button>
          ))}
        </div>
      </div>
      <div className="col-md-9 p-4">
        <Content data={selectedFeed} />
      </div>
    </div>
  </div>
);
