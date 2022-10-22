#include <bits/stdc++.h>
using namespace std;
#define ll long long
#define pb push_back
#define all(a) a.begin(), a.end()
#define tr(c, it) for (typeof(c.begin()) it = c.begin(); it != c.end(); it++)
#define present(c, i) (c.find(i) != c.end())
#define cpresent(c, i) (find(all(c), i) != c.end())
#define LECTSIZE 1
#define LABSIZE 2
#define TUTSIZE 2

string input,finalTT;
stringstream ss;
// make 2 graphs 
// firstly it is periods and secondly is all period numbers for bans/allowed period nos.

fstream fin("input.txt",ios::in|ios::out);


// colorLimit is max times a period can be assigned
ll vertices, subjectCount, number = -1, maxColor = 100, maxAllowedClasses = 2, beforeBreak, afterBreak, days, Lects = 0, Labs = 0, Tuts = 0;

class Period
{
public:
    ll id, length;
    string subjectName, Room, Prof, Bans;
    vector<string> Group;
    Period()
    {
        id = -1;
        length = 1; // represents how many colors to assign a vertex
        Room = Prof = Bans = "none";
    }
};

class Subject
{
public:
    string name;
    vector<Period> Lab, Tut, Lecture;
    ll lectCount, labCount, tutCount;
    Subject()
    {
        name = "none";
    }
};

vector<vector<ll>> mat;
vector<vector<bool>> allowed;
vector<Subject> subjects;
map<ll, Period> m;
map<ll, ll> p;  // give a number to part of a longer period
vector<ll> colors(maxColor, -1), colorLimit(maxColor, maxAllowedClasses);

// print the adjency matrix of graph
void display(vector<vector<ll>> &adj)
{
    ll i, j;
    for (i = 0; i < vertices; i++)
    {
        cout << i << "-> ";
        for (j = 0; j < adj[i].size(); j++)
            cout << adj[i][j] << " ";
        cout << "\n";
    }
}

// check wether 2 periods having their groups, have some groups in common or not
bool groupCheck(vector<string> &a, vector<string> &b)
{
    ll i, j;
    for (i = 0; i < a.size(); i++)
        for (j = 0; j < b.size(); j++)
            if (a[i] == b[j])
                return true;
    return false;
}

// map the ids (numbers from 1 to max periods) to the corr. period
// map a period to its part number
void makeIds()
{
    ll i, j, k;
    for (i = 0; i < subjectCount; i++)
    {
        for (j = 0; j < subjects[i].lectCount; j++)
        {
            for (k = 0; k < LECTSIZE; k++)
            {
                // cout << subjects[i].Lecture[LECTSIZE * j + k].id << " ";
                m[subjects[i].Lecture[LECTSIZE * j + k].id] = subjects[i].Lecture[LECTSIZE * j + k];
                p[subjects[i].Lecture[LECTSIZE * j + k].id]=k;
            }
        }
        for (j = 0; j < subjects[i].labCount; j++)
        {
            for (k = 0; k < LABSIZE; k++)
            {
                // cout << subjects[i].Lab[LABSIZE * j + k].id << " ";
                m[subjects[i].Lab[LABSIZE * j + k].id] = subjects[i].Lab[LABSIZE * j + k];
                p[subjects[i].Lab[LABSIZE * j + k].id]=k;
            }
        }
        for (j = 0; j < subjects[i].tutCount; j++)
        {
            for (k = 0; k < TUTSIZE; k++)
            {
                // cout << subjects[i].Tut[TUTSIZE * j + k].id << " ";
                m[subjects[i].Tut[TUTSIZE * j + k].id] = subjects[i].Tut[TUTSIZE * j + k];
                p[subjects[i].Tut[TUTSIZE * j + k].id]=k;
            }
        }
        // cout << "\n";
    }
}

// can vertex vertex be assigned the color c
bool isSafe(ll vertex, ll c)
{
    ll i;
    if (!allowed[vertex][c] || !colorLimit[c])
        return false;
    for (i = 0; i < mat[vertex].size(); i++)
        if (colors[mat[vertex][i]] == c)
            return false;
    return true;
}

// allowed is essentially the second graph
// set legal periods to be true for all days (acc. to length)
void updateAllowed()
{
    ll i, j, n, k, jump = (beforeBreak + afterBreak);
    allowed.resize(vertices,vector<bool>(maxColor,false));
    for (i = 0; i < vertices; i++)
    {
        for (j = 0; j < maxColor; j++)
            allowed[i][j] = false;
    }
    for (i = 0; i < vertices; i++)
    {
        if(m[i].Bans=="none")
        {
            vector<ll> legal;
            for (j = 0; j + m[i].length - 1 < beforeBreak; j += m[i].length)
            {
                for (k = 0; k < days; k++)
                    legal.pb(j + k * jump);
            }
            for (j = beforeBreak; j + m[i].length - 1 < beforeBreak + afterBreak; j += m[i].length)
            {
                for (k = 0; k < days; k++)
                    legal.pb(j + k * jump);
            }
            for (auto x : legal)
            {
                allowed[i][x] = true;
            }
        }
        else
        {
            for(j=0;j<m[i].Bans.size();j++)
            {
                // its allowed and if its banned then ban it
                // if(allowed[i][j] && m[i].Bans[j]=='0')
                // allowed[i][j]=false;
                // or just set it according to user
                allowed[i][j]=m[i].Bans[j]=='1';
            }
        }
    }
}

// if room, prof, or student groups are same, then make an edge
void makeGraph()
{
    ll i, j, n;
    vertices = number+1; // was initially set to the next line
    mat.resize(vertices); // nodes==number, because number is 0 indexed
    for (i = 0; i < vertices; i++)
    {
        // m[i] gives us ith period as Period, so we have duration factor;
        for (j = i + 1; j < vertices; j++)
        {
            // if ith and jth period have some common then make an edge
            if ((m[i].Prof == m[j].Prof) || (m[i].Room == m[j].Room) || groupCheck(m[i].Group, m[j].Group))
            {
                mat[i].pb(j);
                mat[j].pb(i);
            }
        }
    }
}

void display(vector<ll> &col)
{
    ll i;
    for (i = 0; i < vertices; i++)
        cout << "Color of vertex " << i + 1 << " = " << col[i] + 1 << "\n";
}

bool graphColoring(ll vertex)
{
    if (vertex >= vertices  )
        return true;
    ll i, j, n;
    for (i = 0; i < maxColor; i++)
    {
        if (!p[vertex] && isSafe(vertex, i))  //vertex must be 0th part and safe to color with i
        {
            for(j=0;j<m[i].length;j++)
            {
                colors[vertex+j]=i+j;
                colorLimit[i+j]--;
            }
            if (graphColoring(vertex + j))
                return true;
            for(j=0;j<m[i].length;j++)
            {
                colors[vertex+j]=0;
                colorLimit[i+j]++;
            }
        }
    }
    return false;
}

void printTimeTable()
{
    ll i,j;
    map<ll,vector<ll> > mapTT;
    for(i=0;i<vertices;i++)
    {
        mapTT[colors[i]].push_back(i);   //colors[i] gives color of ith node, tt[i] give node of color[i]
    }
    for(i=0;i<maxColor;i++)
    {
        if(mapTT.find(i)==mapTT.end())
        mapTT[i]={-1};
    }
    for(i=0;i<days;i++)
    {
        for(j=0;j<(beforeBreak+afterBreak);j++)
            {
                for(auto x:mapTT[(beforeBreak+afterBreak)*i+j])
                cout<<x+1<<",";
                cout<<" ";
            }
        cout<<"\n";
    }
}

string mergeGroups(vector<string> &a)
{
    string result="";
    for(auto x:a)
    result+=x+" ";
    return result;
}

void makeTT()
{
    finalTT="";
    map<ll,string> schedule;
    int i;
    for(i=0;i<vertices;i++)
    if(schedule.find(colors[i])==schedule.end())
    schedule[colors[i]]=m[i].subjectName+"|"+m[i].Room+"|"+m[i].Prof+"|"+mergeGroups(m[i].Group);
    else
    schedule[colors[i]]+="+"+m[i].subjectName+"|"+m[i].Room+"|"+m[i].Prof+"|"+mergeGroups(m[i].Group);
    for(i=0;i<schedule.size()-1;++i)
    finalTT+="\""+to_string(i)+"\":\""+schedule[i]+"\",\n";
    finalTT+="\""+to_string(i)+"\":\""+schedule[i]+"\"\n";
}

void setupTT()
{
    number = -1;
    Lects=Labs=Tuts=0;
    maxColor = 100;
    finalTT="Invalid Input";
    mat.resize(0);
    allowed.resize(0);
    subjects.clear();
    colors.resize(0);
    colorLimit.resize(0);
    m.clear();
    p.clear();
}

void solve()
{
    setupTT();
    ss=stringstream(input);
    ll i, groupCount, temp, maxLectCount = -1, maxTutCount = -1, maxLabCount = -1, k, j, size;
    string s1, s2, s3, s4;
    // cout << "Number of days college is open: ";
    ss >> days;
    // cout << "Number of periods before break: ";
    ss >> beforeBreak;
    // cout << "Number of periods after break: ";
    ss >> afterBreak;
    maxColor = (beforeBreak + afterBreak) * days;
    colors.resize(maxColor,-1);
    colorLimit.resize(maxColor,maxAllowedClasses);
    // allowed.resize(maxColor,vector<bool>(maxColor,false));

    // cout << "Enter number of subjects: ";
    ss >> subjectCount;
    subjects.resize(subjectCount);
    for (i = 0; i < subjectCount; i++)
    {
        // cout << "Enter " << i << " subject name:";
        ss >> subjects[i].name;

        // cout << "Number of lectures:";
        ss >> subjects[i].lectCount;
        Lects += subjects[i].lectCount;
        maxLectCount = max(maxLectCount, subjects[i].lectCount);
        if (subjects[i].lectCount)
        {
            size = LECTSIZE;
            subjects[i].Lecture.resize(size * subjects[i].lectCount); // basically initialised lectcount number of periods for lectures
            for (j = 0; j < subjects[i].lectCount; j++)
            {
                // cout << "Enter lecturer name: ";
                ss >> s1;
                // cout << "Enter number of groups attending: ";
                ss >> groupCount;
                vector<string> tempGroup;
                while (groupCount--)
                {
                    ss >> s2;
                    tempGroup.pb(s2);
                }
                // cout << "Enter room: ";
                ss >> s3;
                // cout << "Enter bans: ";
                ss >> s4;
                for (k = 0; k < size; k++)
                {
                    // for (j = 0; j < subjects[i].lectCount; j++)
                    {
                        subjects[i].Lecture[size * j + k].Room = s3;
                        subjects[i].Lecture[size * j + k].Group = tempGroup;
                        subjects[i].Lecture[size * j + k].Prof = s1;
                        subjects[i].Lecture[size * j + k].Bans = s4;
                        subjects[i].Lecture[size * j + k].subjectName = subjects[i].name+"-L";
                    }
                }
            }
        }
        // cout << "Number of tutorials:";
        ss >> subjects[i].tutCount;
        Tuts += subjects[i].tutCount;
        maxTutCount = max(maxTutCount, subjects[i].tutCount);
        if (subjects[i].tutCount)
        {
            // size = subjects[i].Tut[0].length;
            size = TUTSIZE;
            subjects[i].Tut.resize(size * subjects[i].tutCount); // basically 2*tuts periods
            for (j = 0; j < subjects[i].tutCount; j++)
            {
                // cout << "Enter tutorial-coordinator name: ";
                ss >> s1;
                // cout << "Enter number of groups attending: ";
                ss >> groupCount;
                vector<string> tempGroup;
                while (groupCount--)
                {
                    ss >> s2;
                    tempGroup.pb(s2);
                }
                // cout << "Enter room: ";
                ss >> s3;
                // cout << "Enter bans: ";
                ss >> s4;
                for (k = 0; k < size; k++)
                {
                    subjects[i].Tut[size * j + k].Room = s3;
                    subjects[i].Tut[size * j + k].Group = tempGroup;
                    subjects[i].Tut[size * j + k].Prof = s1;
                    subjects[i].Tut[size * j + k].length = size;
                    subjects[i].Tut[size * j + k].Bans = s4;
                    subjects[i].Tut[size * j + k].subjectName = subjects[i].name+"-T";
                }
            }
        }
        // cout << "Number of labs:";
        ss >> subjects[i].labCount;
        maxLabCount = max(maxLabCount, subjects[i].labCount);
        Labs += subjects[i].labCount;
        if (subjects[i].labCount)
        {
            size = LABSIZE;
            subjects[i].Lab.resize(size * subjects[i].labCount); // basically 2*tuts periods
            for (j = 0; j < subjects[i].labCount; j++)
            {
                // cout << "Enter tutorial-coordinator name: ";
                ss >> s1;
                // cout << "Enter number of groups attending: ";
                ss >> groupCount;
                vector<string> tempGroup;
                while (groupCount--)
                {
                    ss >> s2;
                    tempGroup.pb(s2);
                }
                // cout << "Enter room: ";
                ss >> s3;
                // cout << "Enter bans: ";
                ss >> s4;
                for (k = 0; k < size; k++)
                {
                    subjects[i].Lab[size * j + k].Room = s3;
                    subjects[i].Lab[size * j + k].Group = tempGroup;
                    subjects[i].Lab[size * j + k].Prof = s1;
                    subjects[i].Lab[size * j + k].length = size;
                    subjects[i].Lab[size * j + k].Bans = s4;
                    subjects[i].Lab[size * j + k].subjectName = subjects[i].name+"-Lab";
                }
            }
        }
    }

    // number lectures across subjects
    for (k = 1; k <= (maxLectCount + maxLabCount + maxTutCount); k++)
    {
        for (i = 0; i < subjectCount; i++) // i is ith subject
        {
            if (subjects[i].lectCount < k)
            {
                // subject i ke tuts dhund fir lab
                if ((subjects[i].tutCount + subjects[i].lectCount) < k)
                {
                    if ((subjects[i].tutCount + subjects[i].lectCount + subjects[i].labCount) < k)
                    {
                        continue;
                    }
                    for (j = 0; j < LABSIZE; j++)
                    {
                        subjects[i].Lab[LABSIZE * (k - subjects[i].tutCount - subjects[i].lectCount - 1) + j].id = ++number;
                    }
                    continue;
                }
                for (j = 0; j < TUTSIZE; j++)
                {
                    subjects[i].Tut[TUTSIZE * (k - subjects[i].lectCount - 1) + j].id = ++number;
                }
                continue;
            }
            for (j = 0; j < LECTSIZE; j++)
            {
                subjects[i].Lecture[LECTSIZE * (k - 1) + j].id = ++number;
            }
        }
    }

    // cout << "\n";
    // ids of all
    makeIds();
    makeGraph();

    // cout<<"part numbers:\n";
    // for(i=0;i<vertices;i++)
    // cout<<i<<" "<<p[i]<<"\n";
    // display(mat);

    updateAllowed();
    if (graphColoring(0))
        // display(colors);
    printTimeTable();
    makeTT();
}

// int main()
// {
//     ios_base::sync_with_stdio(false);
//     cin.tie(NULL);
//     input="5 5 4 6 NA 3 tina 4 L1 L2 M1 M2 audi 111111111111111111111111111111111111111111111 tina 4 L1 L2 M1 M2 audi 111111111111111111111111111111111111111111111 tina 4 L1 L2 M1 M2 audi 111111111111111111111111111111111111111111111 0 4 tina 1 L1 C1 111111111111111111111111111111111111111111111 tina 1 L2 C1 111111111111111111111111111111111111111111111 pankaj 1 M1 C2 111111111111111111111111111111111111111111111 pankaj 1 M2 C2 111111111111111111111111111111111111111111111 DMS 3 vivek 4 L1 L2 M1 M2 audi 111111111111111111111111111111111111111111111 vivek 4 L1 L2 M1 M2 audi 111111111111111111111111111111111111111111111 vivek 4 L1 L2 M1 M2 audi 111111111111111111111111111111111111111111111 4 vivek 1 L1 S1 111111111111111111111111111111111111111111111 vivek 1 L2 S1 111111111111111111111111111111111111111111111 vivek 1 M1 S1 111111111111111111111111111111111111111111111 vivek 1 M2 S1 111111111111111111111111111111111111111111111 0 CAO 3 vivek 4 L1 L2 M1 M2 audi 111111111111111111111111111111111111111111111 vivek 4 L1 L2 M1 M2 audi 111111111111111111111111111111111111111111111 vivek 4 L1 L2 M1 M2 audi 111111111111111111111111111111111111111111111 0 0 PC 1 vivek 4 L1 L2 M1 M2 111111111111111111111111111111111111111111111 audi 0 4 vivek 1 L1 C2 111111111111111111111111111111111111111111111 manisha 1 L2 C1 111111111111111111111111111111111111111111111 deep 1 M1 C2 111111111111111111111111111111111111111111111 jain 1 M2 C2 111111111111111111111111111111111111111111111 DSA 3 manisha 4 L1 L2  M1 M2 audi 111111111111111111111111111111111111111111111 manisha 4 L1 L2  M1 M2 audi 111111111111111111111111111111111111111111111 manisha 4 L1 L2  M1 M2 audi 111111111111111111111111111111111111111111111 0 4 manisha 1 L1 C2 111111111111111111111111111111111111111111111 manisha 1 L2 C2 111111111111111111111111111111111111111111111 manisha 1 M1 C1 111111111111111111111111111111111111111111111 manisha 1 M2 C1 111111111111111111111111111111111111111111111 OS 3 jain 4 L1 L2  M1 M2 audi 111111111111111111111111111111111111111111111 jain 4 L1 L2  M1 M2 audi 111111111111111111111111111111111111111111111 jain 4 L1 L2  M1 M2 audi 111111111111111111111111111111111111111111111 0 4 jain 1 L1 C2 111111111111111111111111111111111111111111111 jain 1 L2 C2 111111111111111111111111111111111111111111111 jain 1 M1 C1 111111111111111111111111111111111111111111111 jain 1 M2 C2 111111111111111111111111111111111111111111111";
//     solve();
//     return 0;
// }

//input format
//days,beforebreak,afterbreak
// subjectcount
//   for each subject
//   subjectname
//   lectcount
//     for each lectcount
//     lecturer, groupcount, 
//       for each groupcount
//       groupname
//     room
//     bans
//   similarly tut and lab

// does order of backtracking matter? i dont think so, hence not doing it on basis of vertex degree
// its not true order does matter and im a retard i need to color on basis of indegree