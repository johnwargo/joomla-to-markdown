type Category = {
  name: string;
  path: string;
  idx: number;
};

type Article = {
  name: string;
  path: string;
  idx: number;
};


function getCategories(filePath: string[]): Category[] {
  return []
}

function getArticles(filePath: string[]): Article[] {
  return []
}


exports(getArticles, getCategories)