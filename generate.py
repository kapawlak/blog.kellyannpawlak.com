from pathlib import Path
import json
import regex as re


def GenerateDir():
    """ Generates the directory tree of the current qexp_data directory. The data dashboard relies on this tree to navigate results. 
        """
    root=Path.cwd().joinpath('pages')
    results = WalkDir(root)
    directory_list={"page-links": results}
    with open(Path.cwd().joinpath('index.json'),'w') as f:
        json.dump(directory_list,f, indent=2)
    return directory_list["page-links"]


def WalkDir(dir: Path):
    """ Utility: Walks current directory (recursive).
        Parameters:
            - dir (Path): current directory. 
        """
    curr={}
    this_level=[str(x.parts[-1]) for x in Path(dir).iterdir()]
    if this_level == []:
        return {}
    else:
        for thing in this_level:
            if dir.joinpath(thing).is_dir():
                curr[thing] = WalkDir(dir.joinpath(thing))
            elif thing[0] == '_':
                    pass
            else:
                title=''
                with open(Path(dir).joinpath(thing), "r") as file:
                    title = file.readline()
                title=title.replace('#','').strip()
                curr[thing] = title
    return curr


def GenerateIndex(data):
    root=Path.cwd().joinpath('pages')
    savestring='# Blog Index\n'
    for k in data.keys():
        if k=="Home.md" or k=="index.md":
            pass
        else:
            print(k)
            savestring+=f'# {k}\n'
            for k2 in data[k].keys():
                savestring+=f'''- [{data[k][k2]}](?linkfile={k}/{k2})  \n'''

    with open(root.joinpath('index.md'),'w') as f:
        f.write(savestring)

    



if __name__ == "__main__":

    data = GenerateDir()
    GenerateIndex(data)